import { pipeFlow } from "../src";
import { pipeContext, pipeState } from "./fixtures/data";

it("Return the flowbox", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    (thing) => thing
  )()(pipeContext);

  expect(typeof returnedFromFlow.context.processName).toBe("string");
  expect(returnedFromFlow.context.isContext).toBe(true);
});

it("Add data to the state", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof pipeState>(
    (thing) => thing,
    (thing) => {
      thing.state = pipeState;

      return thing;
    }
  )()(pipeContext);

  expect(returnedFromFlow.state.isState).toBe(true);
});

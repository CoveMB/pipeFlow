import { pipeFlow } from "../src";
import { pipeContext, pipeState } from "./fixtures/data";

it("Return undefined if nothing is attached to return key", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>((ignore) => {
    const test = true;

    return { key: "test", value: test };
  })()(pipeContext);

  expect(returnedFromFlow).toBe(undefined);
});

it("Return what is attached to return key", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>((box) => {
    box.return = "surprise";
  })()(pipeContext);

  expect(returnedFromFlow).toBe("surprise");
});

it("Add data to the state", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof pipeState>(
    (ignore) => pipeState,
    (box) => {
      box.return = { ...box.state };
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(pipeState));
});

it("Merged data added to the state", async () => {
  const oldValue = { oldValue: true };
  const newValue = { newValue: true };

  type allValues = typeof oldValue & typeof newValue;

  const returnedFromFlow = await pipeFlow<
    typeof pipeContext,
    allValues,
    allValues
  >(
    () => oldValue,
    () => newValue,
    (box) => {
      box.return = { ...box.state };
    }
  )()(pipeContext);

  expect(returnedFromFlow.oldValue).toBe(true);
  expect(returnedFromFlow.newValue).toBe(true);
});

it("Should return return from box", async () => {
  const bodyToReturn = { test: "bip", success: true };

  const returnedFromFlow = await pipeFlow(
    (box) => {
      box.return = bodyToReturn;
    },
    (ignore) => ({ data: "something" })
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(bodyToReturn));
});

/* eslint-disable unicorn/consistent-function-scoping */
import { FlowBox } from "../src/types";
import { pipeFlow } from "../src";
import { pipeContext } from "./fixtures/data";

it("Only allowed key of box can be mutated", async () => {
  const originalLog = console.error;

  console.error = jest.fn();

  const wrongMiddleware = (box: FlowBox) => {
    box.state = { name: true };
    // @ts-expect-error
    box.mutation = 9;

    return box;
  };

  await pipeFlow(wrongMiddleware)()(pipeContext);

  expect(console.error).toHaveBeenCalledWith(
    `
    Flow Error: Is seems you might be mutating the box, only the state property of the box is allowed to be extended, use it to pass data from one function to an other.

    This error has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );
  console.error = originalLog;
});

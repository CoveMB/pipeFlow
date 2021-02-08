/* eslint-disable unicorn/consistent-function-scoping */
import { FlowContext } from "../src/types";
import { pipeFlow } from "../src";
import { pipeContext } from "./fixtures/data";

it("Only allowed key of context can be mutated", async () => {
  const originalLog = console.error;

  console.error = jest.fn();

  const wrongMiddleware = (context: FlowContext) => {
    context.state = { name: true };
    // @ts-expect-error
    context.mutation = 9;
  };

  await pipeFlow(wrongMiddleware)()(pipeContext);

  expect(console.error).toHaveBeenCalledWith(
    `
    Flow Error: Is seems you might be mutating the "context", only the state and return property of the "context" are allowed to be extended, use the state property to pass data from one function to an other, and return to control what you want to return.

    This error has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );
  console.error = originalLog;
});

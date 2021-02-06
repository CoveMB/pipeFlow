/* eslint-disable unicorn/consistent-function-scoping */
import { FlowBox } from "../src/types";
import { pipeFlow } from "../src";
import { pipeContext } from "./fixtures/data";

it("A middleware has to return a box", async () => {
  const originalLog = console.log;

  console.log = jest.fn();

  const wrongMiddleware = (box: FlowBox): void => {
    box.state = { number: 200 };
  };

  await pipeFlow(
    (box) => {
      box.state.number = 200;

      return box;
    },
    // @ts-expect-error
    wrongMiddleware
  )()(pipeContext);

  expect(console.log).toHaveBeenCalledWith(
    `
    Flow Error: Your middleware did not returned a box to be passed on to the next one, instead it returned: undefined

    This error has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );

  console.log = originalLog;
});

it("Only allowed key of box can be mutated", async () => {
  const originalLog = console.log;

  console.log = jest.fn();

  const wrongMiddleware = (box: FlowBox) => {
    box.state = { name: true };
    // @ts-expect-error
    box.mutation = 9;

    return box;
  };

  await pipeFlow(wrongMiddleware)()(pipeContext);

  expect(console.log).toHaveBeenCalledWith(
    `
    Flow Error: Is seems you might be mutating the box, only the state property of the box is allowed to be extended, use it to pass data from one function to an other.

    This error has occurred in the following middleware:

    ${wrongMiddleware.toString()}
    `
  );
  console.log = originalLog;
});

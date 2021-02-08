/* eslint-disable sonarjs/no-identical-functions */
import { pipeFlow, subFlow } from "../src";
import { FlowError } from "../src/types/error";
import { pipeContext } from "./fixtures/data";

it("The returned value in a subflow is added to the main context", async () => {
  const subData = { subFlow: true } as const;

  type FlowContext = typeof subData;

  const returnedFromFlow = await pipeFlow<
    typeof pipeContext,
    FlowContext,
    FlowContext
  >(
    (ignore) => {
      const test = true;

      return { key: "test", value: test };
    },
    subFlow((ignore) => ({ subFlow: true })),
    (context) => {
      // console.log(context);
      context.return = context.state;
    }
  )()(pipeContext);

  // console.log(returnedFromFlow);

  expect(returnedFromFlow.subFlow).toBe(true);
});

it("If something is added to the return entry in a subflow it is returned from the main flow", async () => {
  const subData = { subFlow: true } as const;

  type FlowContext = typeof subData;

  const returnedFromFlow = await pipeFlow<
    typeof pipeContext,
    FlowContext,
    FlowContext
  >(
    (ignore) => {
      const test = true;

      return { key: "test", value: test };
    },
    subFlow((context) => {
      context.return = { subFlow: true };
    })
  )()(pipeContext);

  expect(returnedFromFlow.subFlow).toBe(true);
});

it("An error happening in a subflow prevent the rest of main flow execution", async () => {
  const subData = { subFlow: true } as const;

  type FlowContext = typeof subData;

  const returnedFromFlow = await pipeFlow<
    typeof pipeContext,
    FlowContext,
    FlowContext
  >(
    (ignore) => {
      const test = true;

      return { key: "test", value: test };
    },
    subFlow((context) => {
      context.error = { code: 8, message: "Oops" };
    }),
    (context) => {
      context.return = context.state;
    }
  )()(pipeContext);

  expect((returnedFromFlow as FlowError).code).toBe(8);
  expect((returnedFromFlow as FlowError).message).toBe("Oops");
});

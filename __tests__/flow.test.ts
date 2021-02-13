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
  const returnedFromFlow = await pipeFlow<typeof pipeContext>((context) => {
    context.return = "surprise";
  })()(pipeContext);

  expect(returnedFromFlow).toBe("surprise");
});

it("Add data to the state", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof pipeState>(
    (ignore) => pipeState,
    (context) => {
      context.return = { ...context.state };
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
    (context) => {
      context.return = { ...context.state };
    }
  )()(pipeContext);

  expect(returnedFromFlow.oldValue).toBe(true);
  expect(returnedFromFlow.newValue).toBe(true);
});

it("Should return return from context", async () => {
  const bodyToReturn = { test: "bip", success: true };

  const returnedFromFlow = await pipeFlow(
    (context) => {
      context.return = bodyToReturn;
    },
    (ignore) => ({ data: "something" })
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(bodyToReturn));
});

it("Should not return undefined if lot of middlewares", async () => {
  const returnedFromFlow = await pipeFlow(
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    () => ({ number: 1 }),
    (context) => {
      context.return = "ok";
    }
  )()(pipeContext);

  expect(returnedFromFlow).toBe("ok");
});

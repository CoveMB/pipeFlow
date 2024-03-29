import {
  addToReturn,
  addToReturnOn,
  addToState,
  addToStateImmutableOn,
  addToStateOn,
  flowIf,
  flowIfElse,
  flowOn,
  flowOnTo,
  pipeFlow,
  returnWith,
} from "../src";
import { pipeContext } from "./fixtures/data";

it("Should add data to the return property of the context", async () => {
  const extraData = { key: "test", value: true };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToReturn(() => extraData)
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Should add data to the return property of the context using state from context", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToReturn((context) => ({
      id: context.input.userId,
    }))
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ id: pipeContext.userId })
  );
});

it("Should add data to the return property of the context on a certain property", async () => {
  const extraData = { key: "test", value: true };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToReturnOn("object", () => extraData)
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ object: extraData })
  );
});

it("Should add data to the return property of the context on a certain property using context property", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToReturnOn("id", (context) => context.input.userId)
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ id: pipeContext.userId })
  );
});

it("Should add data to the state property of the context", async () => {
  const extraData = { key: "test", value: true };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToState(() => extraData),
    (context) => {
      context.return = context.state;
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Should add data to the state property of the context using context", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToState((context) => ({ id: context.input.userId })),
    (context) => {
      context.return = context.state;
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ id: pipeContext.userId })
  );
});

it("Should add data to the state property of the context on a certain property", async () => {
  const extraData = { key: "test", value: true };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToStateOn("object", () => extraData),
    (context) => {
      context.return = context.state;
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ object: extraData })
  );
});

it("Should return the data in the given path if path is string", async () => {
  const extraData = { key: "test", value: true };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToState(() => extraData),
    returnWith("state")
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Should return the data in the given path if path is string using context", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToState((context) => ({ id: context.input.userId })),
    returnWith("state")
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ id: pipeContext.userId })
  );
});

it("Should return the data in the given path if path is array", async () => {
  const extraData = { key: "test", value: true };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToStateOn("object", () => extraData),
    returnWith(["state", "object"])
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Data added with the immutable utility should be immutable", async () => {
  const extraData = { key: "test", value: true, object: { val: true } };

  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof extraData>(
    addToStateImmutableOn("immutable", () => extraData),
    (context) => {
      // @ts-expect-error
      console.log(Object.isFrozen(context.state.immutable));
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context.state.immutable.key = false;
    },
    (context) => {
      context.return = context.state;
    }
  )()(pipeContext);

  // @ts-ignore
  expect(returnedFromFlow.message).toBe(
    "Cannot assign to read only property 'key' of object '#<Object>'"
  );
});

it("Should not execute middleware if predicate is false", async () => {
  const extraData = { key: "test", value: true, object: { val: true } };

  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof extraData>(
    addToStateImmutableOn("immutable", () => extraData),
    flowIf(
      () => true,
      (context) => {
        context.return = { hasExecuted: true };
      }
    )
  )()(pipeContext);

  // @ts-ignore
  expect(returnedFromFlow.hasExecuted).toBe(true);
});

it("Should execute tifTrue middleware if predicate is true", async () => {
  const extraData = { key: "test", value: true, object: { val: true } };

  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof extraData>(
    addToStateImmutableOn("immutable", () => extraData),
    flowIfElse(
      () => true,
      (context) => {
        context.return = { middlewareExecuted: "True" };
      },
      (context) => {
        context.return = { middlewareExecuted: "False" };
      }
    )
  )()(pipeContext);

  // @ts-ignore
  expect(returnedFromFlow.middlewareExecuted).toBe("True");
});

it("Should execute ifFalse middleware if predicate is false", async () => {
  const extraData = { key: "test", value: true, object: { val: true } };

  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof extraData>(
    addToStateImmutableOn("immutable", () => extraData),
    flowIfElse(
      () => false,
      (context) => {
        context.return = { middlewareExecuted: "True" };
      },
      (context) => {
        context.return = { middlewareExecuted: "False" };
      }
    )
  )()(pipeContext);

  // @ts-ignore
  expect(returnedFromFlow.middlewareExecuted).toBe("False");
});

it("Data added with the immutable utility should be immutable using context", async () => {
  const extraData = { key: "test", value: true, object: { val: true } };

  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof extraData>(
    addToStateImmutableOn("immutable", (context) => context.input.userId),
    returnWith(["state"])
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ immutable: pipeContext.userId })
  );
});

it("Should execute a given middleware function a specific of the context", async () => {
  const returnedFromFlow = await pipeFlow(
    (ignore) => ({
      number: 66,
    }),
    flowOn<number>(["state", "number"], (number) => ({
      addedNumber: number + 1,
    })),
    returnWith(["state", "addedNumber"])
  )()(pipeContext);

  expect(returnedFromFlow).toBe(67);
});

it("Should execute a given middleware fon a specific of the context", async () => {
  const returnedFromFlow = await pipeFlow(
    (ignore) => ({
      number: 66,
    }),
    flowOnTo<number>(
      ["state", "number"],
      "addedNumber",
      (number) => number + 1
    ),
    returnWith(["state", "addedNumber"])
  )()(pipeContext);

  expect(returnedFromFlow).toBe(67);
});

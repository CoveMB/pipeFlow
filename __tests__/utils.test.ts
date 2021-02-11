import {
  addToReturn,
  addToReturnOn,
  addToState,
  addToStateOn,
  pipeFlow,
  returnWith,
} from "../src";
import { pipeContext } from "./fixtures/data";

it("Should add data to the return property of the context", async () => {
  const extraData = { key: "test", value: test };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToReturn(() => extraData)
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Should add data to the return property of the context on a certain property", async () => {
  const extraData = { key: "test", value: test };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToReturnOn("object", () => extraData)
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(
    JSON.stringify({ object: extraData })
  );
});

it("Should add data to the state property of the context", async () => {
  const extraData = { key: "test", value: test };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToState(() => extraData),
    (context) => {
      context.return = context.state;
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Should add data to the state property of the context on a certain property", async () => {
  const extraData = { key: "test", value: test };

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
  const extraData = { key: "test", value: test };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToState(() => extraData),
    returnWith("state")
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

it("Should return the data in the given path if path is array", async () => {
  const extraData = { key: "test", value: test };

  const returnedFromFlow = await pipeFlow<typeof pipeContext>(
    addToStateOn("object", () => extraData),
    returnWith(["state", "object"])
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(extraData));
});

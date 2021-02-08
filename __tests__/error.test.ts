import { defaultErrorCode } from "../src/utils/const";
import { errorBuilder, notFoundError, pipeFlow, simpleError } from "../src";
import { pipeContext } from "./fixtures/data";
import { FlowError } from "../src/types/error";

it("If an error occur during the flow it is returned", async () => {
  const returnedFromFlow = (await pipeFlow((context) => {
    try {
      throw new Error("Oups!");
    } catch (error) {
      context.error = simpleError(error);
    }
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
});

it("If an exposed FlowError occur during the flow it return it's message in the error's message and as exposed", async () => {
  const returnedFromFlow = (await pipeFlow((context) => {
    try {
      throw new Error("Not found");
    } catch (error) {
      context.error = notFoundError((error as Error).message);
    }
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(404);
  expect(returnedFromFlow.message).toBe("Not found");
});

it("If an non exposed FlowError occur during the flow it does not return it's message with error and as non exposed", async () => {
  const returnedFromFlow = (await pipeFlow((context) => {
    try {
      throw new Error("Oups!");
    } catch (error) {
      context.error = errorBuilder(6)(error);
    }
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(6);
  expect(returnedFromFlow.message).toBe("Oups!");
});

it("If an error occur and is not catch it is transform as a basic FlowError", async () => {
  const returnedFromFlow = (await pipeFlow((context) => {
    context.state = { number: 899 };

    throw new Error("Oups !");
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
  expect(returnedFromFlow.message).toBe("Oups !");
});

it("If an error callback is supply it execute if an error occurres", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = (await pipeFlow(() => {
    throw new Error("Not found");
  })(() => {
    toMutate = "mutated";
  })(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
  expect(toMutate).toBe("mutated");
});

it("If an error callback is supply it does not execute if no error occurres", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = (await pipeFlow((context) => {
    context.return = { message: "Hello" };
  })(() => {
    toMutate = "mutated";
  })(pipeContext)) as FlowError;

  expect(returnedFromFlow.error).toBe(undefined);
  expect(returnedFromFlow.message).toBe("Hello");
  expect(toMutate).toBe("Not mutated");
});

it("If an error callback is supply it should not modify the returned context", async () => {
  const returnedFromFlow = (await pipeFlow(() => {
    throw new Error("Not found");
  })((context) => {
    context.state = { message: "surprise" };
  })(pipeContext)) as FlowError;

  expect(returnedFromFlow.message).toBe("Not found");
});

it("If an error occurres the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = (await pipeFlow(
    () => {
      throw new Error("Not found");
    },
    (ignore) => {
      toMutate = "mutated";
    }
  )()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
  expect(toMutate).toBe("Not mutated");
});

it("If an error is attached to the context the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = (await pipeFlow(
    (context) => {
      context.error = notFoundError("Could not find this ressource");
    },
    (ignore) => {
      toMutate = "mutated2";
    }
  )()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(404);
  expect(toMutate).toBe("Not mutated");
});

it("If an error occur in an async function and is not catch it is transform as a basic FlowError", async () => {
  const returnedFromFlow = (await pipeFlow(async (ignore) => {
    await Promise.reject(new Error("Promise error"));
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
  expect(returnedFromFlow.message).toBe("Promise error");
});

it("If an a flow error is attached to the context, it return the error and no other entries", async () => {
  const returnedFromFlow = (await pipeFlow((context) => {
    context.error = notFoundError("Not Found");

    const toReturn = { fakeData: true };

    context.return = toReturn;

    return toReturn;
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(404);
  expect(returnedFromFlow.message).toBe("Not Found");
});

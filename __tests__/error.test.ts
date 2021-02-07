import { defaultErrorCode } from "../src/utils/const";
import { errorBuilder, notFoundError, pipeFlow, simpleError } from "../src";
import { pipeContext } from "./fixtures/data";
import { FlowError } from "../src/types/error";

it("If an error occur during the flow it is returned", async () => {
  const returnedFromFlow = (await pipeFlow((box) => {
    try {
      throw new Error("Oups!");
    } catch (error) {
      box.error = simpleError(error);
    }

    return box;
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
});

it("If an exposed FlowError occur during the flow it return it's message in the error's message and as exposed", async () => {
  const returnedFromFlow = (await pipeFlow((box) => {
    try {
      throw new Error("Not found");
    } catch (error) {
      box.error = notFoundError((error as Error).message);
    }

    return box;
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(404);
  expect(returnedFromFlow.message).toBe("Not found");
});

it("If an non exposed FlowError occur during the flow it does not return it's message with error and as non exposed", async () => {
  const returnedFromFlow = (await pipeFlow((box) => {
    try {
      throw new Error("Oups!");
    } catch (error) {
      box.error = errorBuilder(6)(error);
    }

    return box;
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(6);
  expect(returnedFromFlow.message).toBe("Oups!");
});

it("If an error occur and is not catch it is transform as a basic FlowError", async () => {
  const returnedFromFlow = (await pipeFlow((box) => {
    box.state = { number: 899 };

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

  const returnedFromFlow = (await pipeFlow((box) => {
    box.return = { message: "Hello" };
  })(() => {
    toMutate = "mutated";
  })(pipeContext)) as FlowError;

  expect(returnedFromFlow.error).toBe(undefined);
  expect(returnedFromFlow.message).toBe("Hello");
  expect(toMutate).toBe("Not mutated");
});

it("If an error callback is supply it should not modify the returned box", async () => {
  const returnedFromFlow = (await pipeFlow(() => {
    throw new Error("Not found");
  })((box) => {
    box.state = { message: "surprise" };
  })(pipeContext)) as FlowError;

  expect(returnedFromFlow.message).toBe("Not found");
});

it("If an error occurres the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = (await pipeFlow(
    () => {
      throw new Error("Not found");
    },
    (box) => {
      toMutate = "mutated";

      return box;
    }
  )()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
  expect(toMutate).toBe("Not mutated");
});

it("If an error is attached to the box the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = (await pipeFlow(
    (box) => {
      box.error = notFoundError("Could not find this ressource");

      return box;
    },
    (box) => {
      toMutate = "mutated2";

      return box;
    }
  )()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(404);
  expect(toMutate).toBe("Not mutated");
});

it("If an error occur in an async function and is not catch it is transform as a basic FlowError", async () => {
  const returnedFromFlow = (await pipeFlow(async (box) => {
    await Promise.reject(new Error("Promise error"));

    return box;
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(defaultErrorCode);
  expect(returnedFromFlow.message).toBe("Promise error");
});

it("If an a flow error is attached to the box, it return the error and no other entries", async () => {
  const returnedFromFlow = (await pipeFlow((box) => {
    box.error = notFoundError("Not Found");

    const toReturn = { fakeData: true };

    box.return = toReturn;

    return toReturn;
  })()(pipeContext)) as FlowError;

  expect(returnedFromFlow.code).toBe(404);
  expect(returnedFromFlow.message).toBe("Not Found");
});

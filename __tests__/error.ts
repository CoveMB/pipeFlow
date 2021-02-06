import { nonExposedError, notFoundError, pipeFlow, simpleError } from "../src";
import { pipeContext } from "./fixtures/data";

it("If an error occur during the flow it is returned in the error key", async () => {
  const returnedFromFlow = await pipeFlow((box) => {
    try {
      throw new Error("Oups!");

      return box;
    } catch (error) {
      box.error = simpleError(error);
    }

    return box;
  })()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(1);
});

it("If an exposed FlowError occur during the flow it returne it's message in the error's message and as exposed", async () => {
  const returnedFromFlow = await pipeFlow((box) => {
    try {
      throw new Error("Not found");

      return box;
    } catch (error) {
      box.error = notFoundError((error as Error).message);
    }

    return box;
  })()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(404);
  expect(returnedFromFlow.error!.expose).toBe(true);
  expect(returnedFromFlow.error!.message).toBe("Not found");
});

it("If an non exposed FlowError occur during the flow it does not return it's message with error and as non exposed", async () => {
  const returnedFromFlow = await pipeFlow((box) => {
    try {
      throw new Error("Oups!");

      return box;
    } catch (error) {
      box.error = nonExposedError(6)(error);
    }

    return box;
  })()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(6);
  expect(returnedFromFlow.error!.expose).toBe(false);
  expect(returnedFromFlow.error!.message).toBe("Oups!");
});

it("If an error occur and is not catch it is transform as a basic FlowError", async () => {
  const returnedFromFlow = await pipeFlow((box) => {
    box.state.number = 899;

    throw new Error("Oups !");
  })()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(1);
  expect(returnedFromFlow.error!.message).toBe("Oups !");
});

it("If an error callback is supply it execute if an error occurres", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = await pipeFlow(() => {
    throw new Error("Not found");
  })(() => {
    toMutate = "mutated";
  })(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(1);
  expect(toMutate).toBe("mutated");
});

it("If an error callback is supply it does not execute if no error occurres", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = await pipeFlow((box) => {
    box.state.message = "Hello";

    return box;
  })(() => {
    toMutate = "mutated";
  })(pipeContext);

  expect(returnedFromFlow.error).toBe(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(returnedFromFlow.state.message).toBe("Hello");
  expect(toMutate).toBe("Not mutated");
});

it("If an error callback is supply it should not modify the returned box", async () => {
  const returnedFromFlow = await pipeFlow(() => {
    throw new Error("Not found");
  })((box) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    box.state.message = "surprise";

    return box;
  })(pipeContext);

  expect(JSON.stringify(returnedFromFlow.state)).toBe(JSON.stringify({}));
});

it("If an error occurres the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = await pipeFlow(
    () => {
      throw new Error("Not found");
    },
    (box) => {
      toMutate = "mutated";

      return box;
    }
  )()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(1);
  expect(toMutate).toBe("Not mutated");
});

it("If an error is attached to the box the other functions of the flow are not run", async () => {
  let toMutate = "Not mutated";

  const returnedFromFlow = await pipeFlow(
    (box) => {
      box.error = notFoundError("Could not find this ressource");

      return box;
    },
    (box) => {
      toMutate = "mutated2";

      return box;
    }
  )()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(404);
  expect(toMutate).toBe("Not mutated");
});

it("If an error occur in an async function and is not catch it is transform as a basic FlowError", async () => {
  const returnedFromFlow = await pipeFlow(async (box) => {
    await Promise.reject(new Error("Promise error"));

    return box;
  })()(pipeContext);

  expect(returnedFromFlow.error!.code).toBe(1);
  expect(returnedFromFlow.error!.message).toBe("Promise error");
});

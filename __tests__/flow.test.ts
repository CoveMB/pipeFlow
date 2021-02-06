import { pipeFlow } from "../src";
import { pipeContext, pipeState } from "./fixtures/data";

it("Return undefined if nothing is attached to return key", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>((box) => box)()(
    pipeContext
  );

  expect(returnedFromFlow).toBe(undefined);
});

it("Return what is attached to return key", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext>((box) => {
    box.return = "surprise";

    return box;
  })()(pipeContext);

  expect(returnedFromFlow).toBe("surprise");
});

it("Add data to the state", async () => {
  const returnedFromFlow = await pipeFlow<typeof pipeContext, typeof pipeState>(
    (box) => box,
    (box) => {
      box.state = pipeState;

      return box;
    },
    (box) => {
      box.return = pipeState;

      return box;
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(pipeState));
});

it("Should return return from box", async () => {
  const bodyToReturn = { test: "bip", success: true };

  const returnedFromFlow = await pipeFlow(
    (box) => {
      box.return = bodyToReturn;

      return box;
    },
    (box) => {
      box.state = { data: "something" };

      return box;
    }
  )()(pipeContext);

  expect(JSON.stringify(returnedFromFlow)).toBe(JSON.stringify(bodyToReturn));
});

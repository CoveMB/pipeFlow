import { flow, pipe } from "fp-ts/lib/function";
import * as R from "ramda";
import { ErrorCallbackHandler } from "./types/error";
import { readOnly, tryCatchAsync } from "@bjmrq/utils";
import { logError } from "./utils/guards-messages";
import {
  CreateBox,
  PipeFlow,
  ErrorOut,
  FlowMiddleware,
  FlowBoxWithError,
  FlowBox,
  NewState,
} from "./types";
import enhancedErrors from "./utils/guards-reasons";

// @internal
const createBox: CreateBox = (context) =>
  Object.seal({
    state: {},
    context: readOnly(context),
    return: undefined,
    error: undefined,
  });

// @internal
const returnData = async (box: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  flow(
    R.ifElse(
      flow(R.prop("error"), R.is(Object)),
      R.prop("error"),
      R.prop("return")
    )
  )(await box);

// @internal
const updateBoxState = (middleware: FlowMiddleware) => async (box: FlowBox) =>
  R.assoc(
    "state",
    // eslint-disable-next-line @typescript-eslint/await-thenable
    R.merge(box.state, (await middleware(box)) as NewState),
    box
  );

// @internal
const notCatchedErrors = (middleware: FlowMiddleware) => (
  error: Error,
  errorBox: FlowBoxWithError
) =>
  pipe(
    errorBox,
    R.assoc("error", enhancedErrors(middleware)(error)),
    R.tap(logError)
  );

// @internal
const errorOut: ErrorOut = (middleware) => async (box) =>
  // @ts-expect-error
  flow(
    R.unless(
      flow(R.prop("error"), R.is(Object)),
      tryCatchAsync(updateBoxState(middleware), notCatchedErrors(middleware))
    )
    // @ts-expect-error
  )(await box);

// @internal
const errorCallbackHandler: ErrorCallbackHandler = (errorCallback) => async (
  box
) =>
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  R.when(
    flow(R.prop("error"), R.is(Object)),
    // @ts-expect-error
    flow(R.clone, errorCallback, R.always(await box))
  )(await box);

/**
 * Will process the APIGateway event through your middlewares and then return it's response
 * @param {Array<FlowMiddleware<M>>} ...middlewares - All the middleware that will process your APIGateway event
 * @returns {Partial<FlowBox>} - The response to be return the APIGateway
 */
const pipeFlow: PipeFlow = (...middlewares) => (errorCallback = R.identity) =>
  // @ts-expect-error
  flow(
    createBox,
    ...R.map(errorOut)(middlewares),
    errorCallbackHandler(errorCallback),
    returnData
  );

export { pipeFlow };

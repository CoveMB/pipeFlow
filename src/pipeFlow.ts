import { flow, pipe } from "fp-ts/lib/function";
import * as R from "ramda";
import { ErrorCallbackHandler } from "./types/error";
import { readOnly, tryCatchAsync } from "@bjmrq/utils";
import { logError } from "./utils/guards-messages";
import {
  CreateContext,
  PipeFlow,
  ErrorOut,
  FlowMiddleware,
  FlowContextWithError,
  FlowContext,
  NewState,
  SubFlow,
} from "./types";
import enhancedErrors from "./utils/guards-reasons";

// @internal
const createContext: CreateContext = (input) =>
  Object.seal({
    state: {},
    input: readOnly(input),
    return: undefined,
    error: undefined,
  });

// @internal
const returnData = async (context: Promise<FlowContext>) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  flow(
    R.ifElse(
      flow(R.prop("error"), R.is(Object)),
      R.prop("error"),
      R.prop("return")
    )
  )(await context);

// @internal
const updateContextState = (middleware: FlowMiddleware) => async (
  context: FlowContext
) =>
  R.assoc(
    "state",
    // eslint-disable-next-line @typescript-eslint/await-thenable
    R.merge(context.state, (await middleware(context)) as NewState),
    context
  );

// @internal
const notCatchedErrors = (middleware: FlowMiddleware) => (
  error: Error,
  errorContext: FlowContextWithError
) =>
  pipe(
    errorContext,
    R.assoc("error", enhancedErrors(middleware)(error)),
    R.tap(logError)
  );

// @internal
const errorOut: ErrorOut = (middleware) => async (context) =>
  // @ts-expect-error
  flow(
    R.unless(
      flow(R.prop("error"), R.is(Object)),
      tryCatchAsync(
        updateContextState(middleware),
        notCatchedErrors(middleware)
      )
    )
    // @ts-expect-error
  )(await context);

// @internal
const errorCallbackHandler: ErrorCallbackHandler = (errorCallback) => async (
  context
) =>
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  R.when(
    flow(R.prop("error"), R.is(Object)),
    // @ts-expect-error
    flow(R.clone, errorCallback, R.always(await context))
  )(await context);

/**
 * Will process your data encapsulated in a "context" through your middlewares and then return it's response
 * @param {Array<FlowMiddleware<M>>} ...middlewares - All the middleware that will process your "context"
 * @returns {Promise<FlowContext<M, Y, X>["return"]>} - The returned value from your flow
 */
const pipeFlow: PipeFlow = (...middlewares) => (errorCallback = R.identity) =>
  // @ts-expect-error
  flow(
    createContext,
    ...R.map(errorOut)(middlewares),
    errorCallbackHandler(errorCallback),
    returnData
  );

/**
 * A sub routine to use with pipeFlow that will pass the "context" of pipeFlow through your functions
 * @param {Array<FlowMiddleware<M>>} ...middlewares - All the middleware that will process your "context"
 * @returns {Promise<FlowContext<M, Y, X>["state"]>} - The returned value from your flow
 */
const subFlow: SubFlow = (...middlewares) =>
  // @ts-expect-error
  flow(
    ...R.map(errorOut)(middlewares),
    // @ts-expect-error
    async (context: Promise<FlowContext>) =>
      R.prop("state")(await context) as FlowContext
  );

export { pipeFlow, subFlow };

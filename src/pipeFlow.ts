import { readOnly, tryCatchAsync } from "@bjmrq/utils";
import * as R from "ramda";
import {
  CreateContext,
  ErrorOut,
  FlowContext,
  FlowContextWithError,
  FlowMiddleware,
  PipeFlow,
  SubFlow,
  ToState,
} from "./types";
import { ErrorCallbackHandler } from "./types/error";
import { logError } from "./utils/guards-messages";
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
  R.pipe(
    R.ifElse(
      R.pipe(R.prop("error"), R.is(Object)),
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
    R.merge(context.state, (await middleware(context)) as ToState),
    context
  );

// @internal
const notCatchedErrors = (middleware: FlowMiddleware) => (
  error: Error,
  errorContext: FlowContextWithError
) =>
  R.pipe(
    // @ts-expect-error
    R.assoc("error", enhancedErrors(middleware)(error)),
    R.tap(logError)
    // @ts-expect-error
  )(errorContext);

// @internal
const errorOut: ErrorOut = (middleware) => async (context) =>
  // @ts-expect-error
  R.pipe(
    R.unless(
      // @ts-expect-error
      R.pipe(R.prop("error"), R.is(Object)),
      tryCatchAsync(
        updateContextState(middleware),
        notCatchedErrors(middleware)
      )
    )
  )(await context);

// @internal
const errorCallbackHandler: ErrorCallbackHandler = (errorCallback) => async (
  context
) =>
  // @ts-expect-error
  R.when(
    // @ts-expect-error
    R.pipe(R.prop("error"), R.is(Object)),
    R.pipe(R.clone, errorCallback, R.always(await context))
    // @ts-expect-error
  )(await context);

/**
 * Will process your data encapsulated in a "context" through your middlewares and then return it's response
 * @param {Array<FlowMiddleware<M>>} ...middlewares - All the middleware that will process your "context"
 * @returns {Promise<FlowContext<M, Y, X>["return"]>} - The returned value from your R.pipe
 */
const pipeFlow: PipeFlow = (...middlewares) => (errorCallback = R.identity) =>
  R.pipe(
    createContext,
    // @ts-expect-error
    ...R.map(errorOut)(middlewares),
    errorCallbackHandler(errorCallback),
    returnData
  );

/**
 * A sub routine to use with pipeFlow that will pass the "context" of pipeFlow through your functions
 * @param {Array<FlowMiddleware<M>>} ...middlewares - All the middleware that will process your "context"
 * @returns {Promise<FlowContext<M, Y, X>["state"]>} - The returned value from your R.pipe
 */
const subFlow: SubFlow = (...middlewares) =>
  R.pipe(
    // @ts-expect-error
    ...R.map(errorOut)(middlewares),
    async (context: Promise<FlowContext>) =>
      R.prop("state")(await context) as FlowContext
  );

export { pipeFlow, subFlow };

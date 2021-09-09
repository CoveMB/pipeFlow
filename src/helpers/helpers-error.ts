import { ErrorBuilder } from "../types/error";
import * as R from "ramda";
import { defaultErrorCode, defaultErrorMessage } from "../utils/const";

/**
 * Help you build the error to be returned by your process, it is a curried function so you can pass it's parameter one at the time. This error should be attached to the error key of the "context"
 * @param {boolean} [statusCode=1] - The code that will be return in the code (default 1)
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to attach to the error key of the "context"
 */
const errorBuilder: ErrorBuilder =
  (code = defaultErrorCode) =>
  (message = defaultErrorMessage) => ({
    code,
    message: R.when(R.is(Error), R.prop("message"))(message) as string,
    error: R.unless(R.is(Object), () => new Error(message as string))(message),
  });

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed false and status code 1, only missing an error or message. This error should be attached to the error key of the "context"
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the "context"
 */
const simpleError = errorBuilder();

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 404, only missing an error or message. This error should be attached to the error key of the "context"
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the "context"
 */
const notFoundError = errorBuilder(404);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 403, only missing an error or message. This error should be attached to the error key of the "context"
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the "context"
 */
const notAuthorizedError = errorBuilder(403);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 422, only missing an error or message. This error should be attached to the error key of the "context"
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the "context"
 */
const unprocessableError = errorBuilder(422);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 9, only missing an error or message. This error should be attached to the error key of the "context"
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the "context"
 */
const argumentError = errorBuilder(9);

export {
  argumentError,
  errorBuilder,
  simpleError,
  notFoundError,
  notAuthorizedError,
  unprocessableError,
};

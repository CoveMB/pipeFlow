import { ErrorBuilder } from "../types/error";
import * as R from "ramda";

/**
 * Help you build the error to be returned by your process, it is a curried function so you can pass it's parameter one at the time. This error should be attached to the error key of the box
 * @param {boolean} [expose=false] - Indicate if you want to expose the error or not (default false)
 * @param {boolean} [statusCode=1] - The code that will be return in the code (default 1)
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to attach to the error key of the box
 */
const errorBuilder: ErrorBuilder = (expose = false) => (code = 1) => (
  message = "Internal Error"
) => ({
  expose,
  code,
  message: R.when(R.is(Error), R.prop("message"))(message) as string,
  error: R.unless(R.is(Object), () => new Error(message as string))(message),
});

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed false and status code 500, only missing an error or message. This error should be attached to the error key of the box
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const simpleError = errorBuilder()();

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true, only missing an statusCode an error or message. This error should be attached to the error key of the box
 * @param {boolean} [statusCode=1] - The code that will be return in the code (default 500)
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const exposedError = errorBuilder(true);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to false, only missing an statusCode an error or message. This error should be attached to the error key of the box
 * @param {boolean} [statusCode=1] - The code that will be return in the code (default 500)
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const nonExposedError = errorBuilder(false);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 404, only missing an error or message. This error should be attached to the error key of the box
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const notFoundError = errorBuilder(true)(404);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 403, only missing an error or message. This error should be attached to the error key of the box
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const notAuthorizedError = errorBuilder(true)(403);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 422, only missing an error or message. This error should be attached to the error key of the box
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const unprocessableError = errorBuilder(true)(422);

/**
 * Help you build the error to be returned by your process, a simple error built from the curried errorBuilder with exposed set to true and status code set to 9, only missing an error or message. This error should be attached to the error key of the box
 * @param {string | Error} [message="Internal Error"] - the message or the error itself, if an error is passed it's message property will be used (default "Internal Error")
 * @returns {FlowError} The built flow error to attach to the box
 */
const argumentError = errorBuilder(true)(9);

export {
  argumentError,
  errorBuilder,
  exposedError,
  nonExposedError,
  simpleError,
  notFoundError,
  notAuthorizedError,
  unprocessableError,
};

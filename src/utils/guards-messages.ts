import { FlowContextWithError, FlowMiddleware } from "../types";

const contextMutated = (middleware: FlowMiddleware) => () =>
  console.error(
    `
    Flow Error: Is seems you might be mutating the "context", only the state and return property of the "context" are allowed to be extended, use the state property to pass data from one function to an other, and return to control what you want to return.

    This error has occurred in the following middleware:

    ${middleware.toString()}
    `
  );

const logError = (errorContext: FlowContextWithError) =>
  console.error(errorContext.error.error);

export { contextMutated, logError };

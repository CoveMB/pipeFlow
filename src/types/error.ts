import { FlowContext, FlowContextWithError } from "./context";

export type FlowError = {
  code: number;
  message: string;
  error?: Error;
};

export type ErrorBuilder = (
  code?: number
) => (message?: string | Error) => FlowError;

export type ErrorCallback<
  M extends FlowContext = FlowContext,
  X extends FlowError = FlowError
> = (context: FlowContextWithError<M, X>) => void;

// @internal
export type ErrorCallbackHandler = (
  errorCallback: ErrorCallback
) => (context: Promise<FlowContext>) => Promise<FlowContext>;

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
  TContext extends FlowContext = FlowContext,
  TError extends FlowError = FlowError
> = (context: FlowContextWithError<TContext, TError>) => void;

// @internal
export type ErrorCallbackHandler = (
  errorCallback: ErrorCallback
) => (context: Promise<FlowContext>) => Promise<FlowContext>;

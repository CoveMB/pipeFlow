import { FlowError } from "./error";

export type FlowContext<TInput = any, TState = any, TReturn = any> = {
  input: Readonly<TInput>;
  state: TState;
  return: TReturn;
  error?: FlowError;
};

export type FlowContextWithError<
  TContext extends FlowContext = FlowContext,
  TError extends FlowError = FlowError
> = TContext & {
  error: TError;
};

export type ToState = Record<string, any>;

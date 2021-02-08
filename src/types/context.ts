import { FlowError } from "./error";

export type FlowContext<M = any, Y = any, X = any> = {
  input: Readonly<M>;
  state: Y;
  return: X;
  error?: FlowError;
};

export type FlowContextWithError<
  M extends FlowContext = FlowContext,
  X extends FlowError = FlowError
> = M & {
  error: X;
};

export type ToState = Record<string, any>;

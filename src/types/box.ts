import { FlowError } from "./error";

export type FlowBox<M = any, Y = any, X = any> = {
  context: Readonly<M>;
  state: Y;
  return: X;
  error?: FlowError;
};

export type FlowBoxWithError<
  M extends FlowBox = FlowBox,
  X extends FlowError = FlowError
> = M & {
  error: X;
};

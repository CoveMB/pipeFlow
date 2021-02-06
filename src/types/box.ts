import { FlowError } from "./error";

export type FlowBox<M = any, Y = any> = {
  context: M;
  state: Y;
  error?: FlowError;
  statusCode?: number;
};

export type FlowBoxWithError<
  M extends FlowBox = FlowBox,
  X extends FlowError = FlowError
> = M & {
  error: X;
};

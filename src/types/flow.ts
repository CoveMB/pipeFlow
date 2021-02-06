import { FlowBox } from "./box";
import { ErrorCallback } from "./error";
import { FlowMiddleware } from "./middleware";

export type PipeFlow = <M = any, Y = any>(
  ...middlewares: Array<FlowMiddleware<FlowBox<M, Partial<Y>>>>
) => (
  errorCallback?: ErrorCallback<FlowBox<M, Y>>
) => (toContext: M) => Promise<FlowBox<M, Y>>;

import { FlowBox } from "./box";
import { ErrorCallback } from "./error";
import { FlowMiddleware } from "./middleware";

export type PipeFlow = <M = unknown, Y = unknown, X = unknown>(
  ...middlewares: Array<FlowMiddleware<FlowBox<M, Partial<Y>>>>
) => (
  errorCallback?: ErrorCallback<FlowBox<M, Y>>
) => (toContext: M) => Promise<FlowBox<M, Y, X>["return"]>;
//  | FlowBox<M, Y, X>["error"]>;

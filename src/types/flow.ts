import { FlowContext } from "./context";
import { ErrorCallback } from "./error";
import { FlowMiddleware } from "./middleware";

export type SubFlow = <M = unknown, Y = unknown>(
  ...middlewares: Array<FlowMiddleware<FlowContext<M, Y>>>
) => FlowMiddleware<FlowContext<M, Y>>;

export type PipeFlow = <M = unknown, Y = unknown, X = unknown>(
  ...middlewares: Array<FlowMiddleware<FlowContext<M, Y>>>
) => (
  errorCallback?: ErrorCallback<FlowContext<M, Y>>
) => (
  toContext: M
) => Promise<FlowContext<M, Y, X>["return"]> &
  Promise<FlowContext<M, Y, X>["error"]>;

import { FlowContext } from "./context";
import { ErrorCallback } from "./error";
import { FlowMiddleware } from "./middleware";

export type SubFlow = <TInput = unknown, TState = unknown>(
  ...middlewares: Array<FlowMiddleware<FlowContext<TInput, TState>>>
) => FlowMiddleware<FlowContext<TInput, TState>>;

export type PipeFlow = <TInput = unknown, TState = unknown, TReturn = unknown>(
  ...middlewares: Array<FlowMiddleware<FlowContext<TInput, TState>>>
) => (
  errorCallback?: ErrorCallback<FlowContext<TInput, TState>>
) => (
  toContext: TInput
) => Promise<FlowContext<TInput, TState, TReturn>["return"]> &
  Promise<FlowContext<TInput, TState, TReturn>["error"]>;

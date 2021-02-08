import { FlowContext, NewState } from "./context";

export type FlowAsyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => Promise<void> | Promise<NewState>;

export type FlowSyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => void | NewState;

export type FlowErrorSyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => void | NewState | Error;

export type FlowErrorAsyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => Promise<void> | Promise<NewState> | Promise<Error>;

export type FlowMiddleware<M extends FlowContext = FlowContext> =
  | FlowAsyncMiddleware<M>
  | FlowSyncMiddleware<M>;

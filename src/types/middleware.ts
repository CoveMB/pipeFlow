import { FlowContext, ToState } from "./context";

export type FlowAsyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => Promise<void> | Promise<ToState>;

export type FlowSyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => void | ToState;

export type FlowErrorSyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => void | ToState | Error;

export type FlowErrorAsyncMiddleware<M extends FlowContext = FlowContext> = (
  context: M
) => Promise<void> | Promise<ToState> | Promise<Error>;

export type FlowMiddleware<M extends FlowContext = FlowContext> =
  | FlowAsyncMiddleware<M>
  | FlowSyncMiddleware<M>;

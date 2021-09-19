import { FlowContext, ToState } from "./context";

export type FlowAsyncMiddleware<TContext extends FlowContext = FlowContext> = (
  context: TContext
) => Promise<void> | Promise<ToState>;

export type FlowSyncMiddleware<TContext extends FlowContext = FlowContext> = (
  context: TContext
) => void | ToState;

export type FlowErrorSyncMiddleware<
  TContext extends FlowContext = FlowContext
> = (context: TContext) => void | ToState | Error;

export type FlowErrorAsyncMiddleware<
  TContext extends FlowContext = FlowContext
> = (context: TContext) => Promise<void> | Promise<ToState> | Promise<Error>;

export type FlowMiddleware<TContext extends FlowContext = FlowContext> =
  | FlowAsyncMiddleware<TContext>
  | FlowSyncMiddleware<TContext>;

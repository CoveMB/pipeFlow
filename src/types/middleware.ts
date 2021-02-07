import { FlowBox, NewState } from "./box";

export type FlowAsyncMiddleware<M extends FlowBox = FlowBox> = (
  box: M
) => Promise<void> | Promise<NewState>;

export type FlowSyncMiddleware<M extends FlowBox = FlowBox> = (
  box: M
) => void | NewState;

export type FlowErrorSyncMiddleware<M extends FlowBox = FlowBox> = (
  box: M
) => void | NewState | Error;

export type FlowErrorAsyncMiddleware<M extends FlowBox = FlowBox> = (
  box: M
) => Promise<void> | Promise<NewState> | Promise<Error>;

export type FlowMiddleware<M extends FlowBox = FlowBox> =
  | FlowAsyncMiddleware<M>
  | FlowSyncMiddleware<M>;

import { FlowBox } from "./box";

export type FlowAsyncMiddleware<M> = (box: M) => Promise<M>;

export type FlowSyncMiddleware<M> = (box: M) => M;

export type FlowErrorSyncMiddleware<M> = (box: M) => M | Error;

export type FlowErrorAsyncMiddleware<M> = (
  box: M
) => Promise<M> | Promise<Error>;

export type FlowMiddleware<M extends FlowBox = FlowBox> =
  | FlowSyncMiddleware<M>
  | FlowAsyncMiddleware<M>;

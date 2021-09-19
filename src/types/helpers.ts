import { FlowContext } from "./context";
import { FlowMiddleware } from "./middleware";

// // Middleware helpers
// // @internal
// export type HandleAsyncMiddleware = <
//   M extends FlowSyncMiddleware<M> | FlowAsyncMiddleware<M>
// >(
//   middleware: M
// ) => (context: Promise<FlowContext<M>>) => Promise<FlowContext<M>>;

// @internal
export type ErrorOut = <TMiddleware extends FlowMiddleware>(
  middleware: TMiddleware
) => (context: Promise<FlowContext>) => Promise<FlowContext>;

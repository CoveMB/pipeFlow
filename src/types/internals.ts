import { FlowContext } from "./context";

// @internal
export type CreateContext = <TContext>(
  context: TContext
) => Partial<FlowContext<TContext>>;

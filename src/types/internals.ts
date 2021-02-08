import { FlowContext } from "./context";

// @internal
export type CreateContext = <M>(context: M) => Partial<FlowContext<M>>;

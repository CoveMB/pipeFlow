import { FlowBox } from "./box";

// @internal
export type CreateBox = <M>(context: M) => Partial<FlowBox<M>>;

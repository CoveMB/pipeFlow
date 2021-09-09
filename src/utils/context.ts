import * as R from "ramda";
import { FlowContext } from "..";

// @internal
const addToProperty = R.curry(
  <M extends Record<any, any> = Record<any, any>>(
    property: keyof FlowContext,
    toReturn: M,
    context: FlowContext
  ): FlowContext[typeof property] & M =>
    R.mergeRight(toReturn, context[property])
);

export { addToProperty };

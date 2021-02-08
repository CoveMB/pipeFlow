import { FlowContext, FlowSyncMiddleware } from "../types";
import * as R from "ramda";

const debugFlow: FlowSyncMiddleware = (context) => console.log(context);

const addToReturn = R.curry(
  <M extends Record<any, any> = Record<any, any>>(
    toReturn: M,
    context: FlowContext
  ): FlowContext["return"] & M => R.merge(toReturn, context.return)
);

export { debugFlow, addToReturn };

import { FlowContext, FlowSyncMiddleware } from "../types";
import * as R from "ramda";

/**
 * Log the context object without stopping process of the flow
 */
const debugFlow: FlowSyncMiddleware = (context) => console.log(context);

/**
 * Little helper to merge some data in the actual state property
 */
const addToReturn = R.curry(
  <M extends Record<any, any> = Record<any, any>>(
    toReturn: M,
    context: FlowContext
  ): FlowContext["return"] & M => R.merge(toReturn, context.return)
);

/**
 * Little helper to merge some data in the actual return property
 */
const addToState = R.curry(
  <M extends Record<any, any> = Record<any, any>>(
    toState: M,
    context: FlowContext
  ): FlowContext["state"] & M => R.merge(toState, context.state)
);

export { debugFlow, addToReturn, addToState };

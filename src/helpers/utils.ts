import * as R from "ramda";
import { FlowContext } from "../types";

/**
 * Log the context object without stopping process of the flow
 */
const debugFlow: (
  path?: string | string[] | number | number[]
) => (context: FlowContext) => void = (path?) => (context) =>
  console.debug(
    // eslint-disable-next-line array-func/prefer-array-from
    path ? R.path([...(Array.isArray(path) ? path : [path])], context) : context
  );

/**
 * Little helper to merge some data in the actual state property
 */
const addToReturn = R.curry(
  <M extends Record<any, any> = Record<any, any>>(
    toReturn: M,
    context: FlowContext
  ): FlowContext["return"] & M => {
    context.return = R.merge(toReturn, context.return);

    return undefined;
  }
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

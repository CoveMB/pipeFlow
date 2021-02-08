import * as R from "ramda";
import { FlowSyncMiddleware } from "../types";
import { addToProperty } from "../utils/context";

/**
 * Log the context object without stopping process of the flow
 */
const debugFlow: (path?: string | string[]) => FlowSyncMiddleware = (path?) => (
  context
) =>
  console.debug(
    // eslint-disable-next-line array-func/prefer-array-from
    path ? R.path([...(Array.isArray(path) ? path : [path])], context) : context
  );

/**
 * Little helper to merge some data in the actual state property
 */
const addToReturn = addToProperty("return");

/**
 * Little helper to merge some data in the actual return property
 */
const addToState = addToProperty("state");

export { debugFlow, addToReturn, addToState };

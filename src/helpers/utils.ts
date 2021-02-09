import * as R from "ramda";
import { FlowContext } from "../types";

/**
 * Log the context object without stopping process of the flow
 */
const debugFlow: (
  path?: string | number | Array<string | number>
) => (context: FlowContext) => void = (path?) => (context) =>
  console.debug(
    // eslint-disable-next-line array-func/prefer-array-from
    path ? R.path([...(Array.isArray(path) ? path : [path])], context) : context
  );

// - - - -

const addToReturnFn = R.curry(
  async <M extends Record<any, any> = Record<any, any>>(
    toReturn: () => M | Promise<M>,
    context: FlowContext
  ): Promise<FlowContext["return"] & M> => {
    context.return = R.merge(await toReturn(), context.return);

    return undefined;
  }
);

const addToReturnOnFn = R.curry(
  async <M extends Record<any, any> = Record<any, any>>(
    keyToAttachOn: string,
    toReturn: () => M | Promise<M>,
    context: FlowContext
  ): Promise<FlowContext["return"] & M> => {
    const base = {};

    // @ts-expect-error
    base[keyToAttachOn] = await toReturn();
    context.return = R.merge(base, context.return);

    return undefined;
  }
);

/**
 * Little helper to merge some data in the actual state property
 */
const addToReturn = addToReturnFn;

/**
 * Little helper to merge some data in the actual state property
 */
const addToReturnOn = addToReturnOnFn;

//  - - - - -

const addToStateFn = R.curry(
  async <M extends Record<any, any> = Record<any, any>>(
    toState: () => M | Promise<M>,
    context: FlowContext
  ): Promise<FlowContext["state"] & M> =>
    R.merge(await toState(), context.state)
);

const addToStateOnFn = R.curry(
  async <M extends Record<any, any> = Record<any, any>>(
    keyToAttachOn: string,
    toState: () => M | Promise<M>,
    context: FlowContext
  ): Promise<FlowContext["state"] & M> => {
    const base = {};

    // @ts-expect-error
    base[keyToAttachOn] = await toState();

    return R.merge(await toState(), context.state);
  }
);

/**
 * Little helper to merge some data in the actual return property
 */
const addToState = addToStateFn;

/**
 * Little helper to merge some data in the actual return property
 */
const addToStateOn = addToStateOnFn;

export { addToStateOn, addToReturnOn, debugFlow, addToReturn, addToState };

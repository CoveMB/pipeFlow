/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable fp/no-mutation */
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
 * @param {() => any} toState - function to attach return value from
 */
const addToReturn = addToReturnFn;

/**
 * Little helper to merge some data in the actual state property
 * @param {string} keyToAttachOn - key to attach value on the return
 * @param {() => any} toState - function to attach return value from
 */
const addToReturnOn = addToReturnOnFn;

// - - - - -

const addToStateFn = R.curry(
  async <M extends Record<any, any> = Record<any, any>>(
    toState: () => M | Promise<M>,
    context: FlowContext
  ): Promise<FlowContext["state"] & M> =>
    R.merge(await toState(), context.state) as FlowContext
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

    return R.merge(base, context.state) as FlowContext;
  }
);

/**
 * Little helper to merge some data in the actual return property
 * @param {() => any} toState - function to attach return value from
 */
const addToState = addToStateFn;

/**
 * Little helper to merge some data in the actual return property
 * @param {string} keyToAttachOn - key to attach value on the state
 * @param {() => any} toState - function to attach return value from
 */
const addToStateOn = addToStateOnFn;

// - - - - -

/**
 * Little helper to simply return a path from the context
 * @param {string | number | Array<string | number>} pathToReturn - key to attach value on the state
 */
const returnWith = (pathToReturn: string | number | Array<string | number>) => (
  context: FlowContext
) => {
  context.return = R.path(
    // eslint-disable-next-line array-func/prefer-array-from
    [...(Array.isArray(pathToReturn) ? pathToReturn : [pathToReturn])],
    context
  );
};

export {
  addToStateOn,
  addToReturnOn,
  debugFlow,
  addToReturn,
  addToState,
  returnWith,
};

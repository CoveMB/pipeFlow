/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable fp/no-mutation */
import { readOnly } from "@bjmrq/utils";
import * as R from "ramda";
import { FlowContext, FlowMiddleware } from "../types";

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
 * Little helper to merge some data in the return property of the context
 * @param {() => any} toState - function to attach return value from
 */
const addToReturn = addToReturnFn;

/**
 * Little helper to merge some data in the return property of the context
 * @param {string} keyToAttachOn - key to attach value on the return
 * @param {() => any} toState - function to attach return value from
 */
const addToReturnOn = addToReturnOnFn;

// - - - - -

const addToStateFn =
  <M extends Record<any, any>>(immutable: boolean) =>
  (toState: () => M | Promise<M>) =>
  async (context: FlowContext): Promise<FlowContext["state"] & M> =>
    R.merge(
      immutable ? readOnly(await toState()) : await toState(),
      context.state
    ) as FlowContext;

const addToStateOnFn =
  <M = unknown>(immutable: boolean) =>
  (keyToAttachOn: string, toState: () => M | Promise<M>) =>
  async (context: FlowContext): Promise<FlowContext["state"] & M> => {
    const base = {};

    // @ts-expect-error
    base[keyToAttachOn] = immutable
      ? readOnly(await toState())
      : await toState();

    return R.merge(base, context.state) as FlowContext;
  };

/**
 * Little helper to merge some data in the state property of the context
 * @param {() => any} toState - function to attach return value from
 */
const addToState = addToStateFn(false);

/**
 * Little helper to merge some data in the state property of the context
 * @param {string} keyToAttachOn - key to attach value on the state
 * @param {() => any} toState - function to attach return value from
 */
const addToStateOn = addToStateOnFn(false);

// /**
//  * Little helper to merge some data in the state property of the context
//  * @param {() => any} toState - function to attach return value from
//  */
// const addToStateImmutable = addToStateFn(true);

/**
 * Little helper to merge some immutable data in the state property of the context
 * @param {string} keyToAttachOn - key to attach value on the state
 * @param {() => any} toState - function to attach return value from
 */
const addToStateImmutableOn = addToStateOnFn(true);

// - - - - -

/**
 * Little helper to simply return a path from the context
 * @param {string | number | Array<string | number>} pathToReturn - key to attach value on the state
 */
const returnWith =
  (pathToReturn: string | number | Array<string | number>) =>
  (context: FlowContext) => {
    context.return = R.path(
      // eslint-disable-next-line array-func/prefer-array-from
      [...(Array.isArray(pathToReturn) ? pathToReturn : [pathToReturn])],
      context
    );
  };

// - - - - -

const flowIfFn =
  <M extends FlowContext>(
    predicateFn: (context: M) => boolean,
    whenTrueMiddleware: FlowMiddleware<M>
  ) =>
  (context: M) =>
    predicateFn(context) ? whenTrueMiddleware(context) : undefined;

/**
 * Execute a given function of the flow only if the given predicate return true
 * @param {(context: FlowContext) => boolean} predicateFn - predicate function
 * @param {FlowMiddleware} whenTrueFn - function to invoke when the `condition` evaluates to a truthy value.
 */
const flowIf = flowIfFn;

// - - - - -

const flowOnFn =
  <M = any, Y = any>(
    keyPathFromContext: [keyof FlowContext, ...string[]],
    middlewareToExecutes: (contextValue: M) => Y
  ): FlowMiddleware<FlowContext> =>
  (context) =>
    middlewareToExecutes(R.path(keyPathFromContext, context) as M);

/**
 * Execute a given function on a given path key from the context
 * @param {[keyof FlowContext, ...string[]]} keyPathFromContext - path of to execute middleware on
 * @param {FlowMiddleware} middlewareToExecutes - middleware to execute
 */
const flowOn = flowOnFn;

// - - - - -

/**
 * Execute a given function on a given path key from the context and attach it to the state on a given key
 * @param {[keyof FlowContext, ...string[]]} keyPathFromContext - path of to execute middleware on
 * @param {FlowMiddleware} middlewareToExecutes - middleware to execute
 * @param {string} keyToAttacheResultOn - key to attach middleware result on
 */
const flowOnTo =
  <M = any, Y = any>(
    keyPathFromContext: [keyof FlowContext, ...string[]],
    middlewareToExecutes: (contextValue: M) => Y | Promise<Y>,
    keyToAttacheResultOn: string
  ): FlowMiddleware<FlowContext> =>
  async (context) =>
    R.assoc(
      keyToAttacheResultOn,
      await middlewareToExecutes(R.path(keyPathFromContext, context) as M),
      {}
    );

export {
  flowOnTo,
  flowOn,
  flowIf,
  addToStateOn,
  addToReturnOn,
  debugFlow,
  addToReturn,
  addToState,
  returnWith,
  addToStateImmutableOn,
};

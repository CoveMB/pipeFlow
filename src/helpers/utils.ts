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

/**
 * Little helper to merge some data in the return property of the context
 * @param {() => any} toState - function to attach return value from
 */
const addToReturn =
  <
    T extends FlowContext = FlowContext,
    M extends Record<any, any> = Record<any, any>
  >(
    toReturn: (context: T) => M | Promise<M>
  ) =>
  async (context: T) => {
    context.return = R.mergeRight(await toReturn(context), context.return);

    return undefined;
  };

/**
 * Little helper to merge some data in the return property of the context
 * @param {string} keyToAttachOn - key to attach value on the return
 * @param {() => any} toState - function to attach return value from
 */
const addToReturnOn =
  <T extends FlowContext = FlowContext, M = any>(
    keyToAttachOn: string,
    toReturn: (context: T) => M | Promise<M>
  ) =>
  async (context: T) => {
    const base = {};

    // @ts-expect-error
    base[keyToAttachOn] = await toReturn(context);
    context.return = R.mergeRight(base, context.return);

    return undefined;
  };

// - - - - -

const addToStateFn =
  <
    T extends FlowContext = FlowContext,
    M extends Record<any, any> = Record<any, any>
  >(
    immutable: boolean
  ) =>
  (toState: (context: T) => M | Promise<M>) =>
  async (context: T): Promise<M & T["state"]> =>
    R.mergeDeepRight(
      immutable ? readOnly(await toState(context)) : await toState(context),
      context.state
    ) as M & T["state"];

const addToStateOnFn =
  <T extends FlowContext = FlowContext, M = any>(immutable: boolean) =>
  (keyToAttachOn: string, toState: (context: T) => M | Promise<M>) =>
  async (context: T): Promise<Record<string, M> & T["state"]> => {
    const base = {};

    // @ts-expect-error
    base[keyToAttachOn] = immutable
      ? readOnly(await toState(context))
      : await toState(context);

    return R.mergeRight(base, context.state) as Record<string, M> & T["state"];
  };

/**
 * Little helper to merge some data in the state property of the context
 * @param {() => any} toState - function to attach return value from
 */
const addToState: <
  T extends FlowContext = FlowContext,
  M extends Record<any, any> = Record<any, any>
>(
  toState: (context: T) => M | Promise<M>
) => (context: T) => Promise<FlowContext["state"] & M> = addToStateFn(false);

/**
 * Little helper to merge some data in the state property of the context
 * @param {string} keyToAttachOn - key to attach value on the state
 * @param {() => any} toState - function to attach return value from
 */
const addToStateOn: <T extends FlowContext = FlowContext, M = any>(
  keyToAttachOn: string,
  toState: (context: T) => M | Promise<M>
) => (context: T) => Promise<Record<string, M> & T["state"]> =
  addToStateOnFn(false);

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
const addToStateImmutableOn: <T extends FlowContext = FlowContext, M = any>(
  keyToAttachOn: string,
  toState: (context: T) => M | Promise<M>
) => (context: T) => Promise<Record<string, M> & T["state"]> =
  addToStateOnFn(true);

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

/**
 * Execute a given function of the flow only if the given predicate return true
 * @param {(context: FlowContext) => boolean} predicateFn - predicate function
 * @param {FlowMiddleware} whenTrueFn - function to invoke when the `condition` evaluates to a truthy value.
 */
const flowIf =
  <M extends FlowContext>(
    predicateFn: (context: M) => boolean,
    whenTrueMiddleware: FlowMiddleware<M>
  ) =>
  (context: M) =>
    predicateFn(context) ? whenTrueMiddleware(context) : undefined;

// - - - - -

/**
 * Execute a given function on a given path key from the context
 * @param {[keyof FlowContext, ...string[]]} keyPathFromContext - path of to execute middleware on
 * @param {FlowMiddleware} middlewareToExecutes - middleware to execute
 */
const flowOn =
  <M = any, Y = any>(
    keyPathFromContext: [keyof FlowContext, ...string[]],
    middlewareToExecutes: (contextValue: M) => Y
  ): FlowMiddleware<FlowContext> =>
  (context) =>
    middlewareToExecutes(R.path(keyPathFromContext, context) as M);

// - - - - -

/**
 * Execute a given function on a given path key from the context and attach it to the state on a given key
 * @param {[keyof FlowContext, ...string[]]} keyPathFromContext - path of to execute middleware on
 * @param {string} keyToAttacheResultOn - key to attach middleware result on
 * @param {FlowMiddleware} middlewareToExecutes - middleware to execute
 */
const flowOnTo =
  <M = any, Y = any>(
    keyPathFromContext: [keyof FlowContext, ...string[]],
    keyToAttacheResultOn: string,
    middlewareToExecutes: (contextValue: M) => Y | Promise<Y>
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

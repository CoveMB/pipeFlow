# PipeFlow
**THIS IS A WORK IN PROGRESS BREAKING CHANGED CAN HAPPEN ANY TIME BEFORE v1 release**

### A little utility to process data in a pipe


This is a little utility to process data in a pipe of functions using node.js runtime.

Your pipeline will flow a "context" containing the data you'll need and want to return thought your functions.

Your pipe will receive some data that will be attached to the "context" as an input, this data will be immutable. 

The "context" also contain a mutable state entry. Anything you return from any of your function will be attached to this state.

In the "context" their is also a return entry so you can control what you wish to return at the end of your pipe.

You will also find some little helpers to help you with error handling.

## Installation
With npm:
```
npm install @bjmrq/pipe-flow
```
With Yarn:
```
yarn add @bjmrq/pipe-flow
```

## Hello Word Example
Javascript:
```js
const handler = pipeFlow(
  (context) => {
    const message = context.input.message // access the context
    context.return = message //control what you want to return
  }
)();// This is for optional error handler

const result = handler({ message: "Hello world" }) // create context from data
console.log(result) // "Hello world"
```
Arity:
```js
pipeFlow(...functions, errorHandler, dataToTransformAsContext)
```

## How It Works
### Combine Functions

You can create a flow made of multiple functions that will execute one after an other from left to right, similar to a *pipe* function.
Those function can either be sync or async functions.

```js
const handler = pipeFlow(
  (context) => {
    console.log(context.input) // {id: 9}

    return { status: "ok" } // Attach data to the state
  },
  async (context) => {
    console.log(context.state.status) // "ok"
  }
)();

handler({ id: 9 });
```


### Move Data Around

If you want to move some data from one function to an other simply return it in an object. Any object you return from one of your function will be merge in the state key of the "context".

```js
const handler = pipeFlow(
  async (context) => {
    const product = await database("products").where(
      "id",
      context.input.productId // Access data from context
    );

    return { product }; // Attach data to the state
  },
  async (context) => {
    const productName = context.state.product.name // Access data from tate

    console.log(productName) // "A great product indeed"
  }
)();

handler({ productId: 9 });
```
#### Those are the keys accessible inside the context:

- **input**: is the immutable input you gave as last argument to your *pipeFlow*
- **state**: is a mutable key that you can use to pass data from one function to another
- **return**: is the data that will be returned from your *pipeFlow*
- **error**: you can attach an error to the error key, doing so will bypass other functions of the flow, only the error handler will be trigger, you can control wether you want to expose this error or not


### Control What is Returned

You need to attach any data you wish to **return** to the return key of the "context", other keys will never be returned.
If an error has happened during the flow it will be returned instead.

```js
const handler = pipeFlow(
  async (context) => {
    const product = await database("products").where(
      "id",
      context.input.productId // Access data from context
    );

    return { product }; // Attach data to the state
  },
  async (context) => {
    context.return = context.state.product // Control data to return
  }
)();

const result = handler({ productId: 9 })
console.log(result) // { id: 9, name: "A great product indeed", type: "product",... }
```

### Create a sub pipe

You can use **subFlow** to branch different flow together subFlow receive an already built context and will be able to attache data to it's return and state property.

```js
const handler = pipeFlow(
  (context) => {
    console.log(context.input) // {id: 9}

    return { status: "ok" } // Attach data to the state
  },
  subFlow(
    async (context) => {
    return { subFlow: true } // "ok"
  },
  (context) => {
    context.return = context.state
  }
  )
)();

const result = handler({ id: 9 });
console.log(result) // { status: "ok", subFlow: true }
```


## Error Handling

### How it Works
If you want to control what is return from your *flowPipe* depending of different errors that might happen you need to attach the error to the error key of the "context". 
This will skip the execution of all other functions in your flow.
*The error should be attach to the "context" and not throw, to control the flow in your application.*
But if you forget to catch an error it will be attach to the "context" as well and returned as

```js
const handler = pipeFlow(
  async (context) => {
    const product = await database("products").where(
      "id",
      context.input.productId // Access data from context
    );

    if(!product) {

      context.error = { // Attache the error on the "context"
        code: 404,
        message: "Product Not Found"
      };

    }

    return { product }; // Attach data to the state
  },
  // If an error has been attach in the previous function this one will not run
  async (context) => {
    const updatedProduct = await database("product").where(
      "id",
      context.state.product.id
    ).update(
      { sold: true}
    );

    context.return = updatedProduct;
  }
)();
```
This will result the following error
```js
{
  code: 404,
  message: 'Product Not found',
  error: Error: Not found
           at ...
}
```

- The type of an error to attach to the error key of the "context" should looks like this:
- **code**: the error code
- **message**: the error message
- **error**: the error itself created from the message, will include stacktrace
```ts
type FlowError = {
  statusCode: number;
  message: string;
  error?: Error;
};
```
*(to help you with formatting errors see the error helpers section)*

- If an **unexpected error** happens during your flow and you did not catch it will return the following response with a HTTP status code of 500
```
{
  "code": 1,
  "message": "Internal Error",
  "error": Error: something wrong happened
              at..
}
```

### Error Helpers
You can use little error helper to format the errors attached to the "context".

- **errorBuilder**: the error builder will help you build the error to be returned to the user, it is a curried function so you can pass it's parameter one at the time. 
- code (default to 1): the error code
- message or error (default to "Internal Error" message): the message that will be attach to the error and use to create Error object

example 1:
```js
context.error = errorBuilder()()
```
Will return 
```
{
  code: 1,
  message: "Internal Error"
  error: new Error()
}
```
example 2:
```js
context.error = errorBuilder(9)(new Error("Could not process arguments"))
// Same as
context.error = errorBuilder(9)("Could not process arguments")
```
Will return 
```
{
  code: 9,
  message: "Could not process arguments",
  error: new Error("Could not process arguments")
}
```

Some predefined ones are derived from the builder but you can easily create yours
- **simpleError**: ```code=1``` provided
- **argumentError**: ```code=9``` provided
- **notFoundError**: ```code=404``` provided
- **notAuthorizedError**: ```code=403``` provided
- **unprocessableError**: ```code=422``` provided

Error builder in action
```js
const notAuthorizedError = errorBuilder(403); // Import 
```
```js
const { notAuthorizedError } = require("@bjmrq/pipe-flow")
exports.handler = pipeFlow(
  (context) => {
    const authorizationToken = context.input.token;

    if (!authorizationToken) {
      context.error = notAuthorizedError("You can't do that");
    }

    return { isAuthenticated: true }; // Only taken in consideration if no error was attached to the "context"
  },
)();
```

### Extra Error Handler
If you wish to have extra logic triggered when an error occurres (send log to remote place, call a cloud service..) you can provide ```pipeFlow``` with an extra function.
```js
exports.handler = pipeFlow(
  async (context) => {

    const product = await database("product").where(
      "id",
      context.state.productId
    );

    if (!product) {
      context.error = notFoundError(new Error("Could not find this product"));
    }
    
    context.return = product
// Extra error handler
)((context) => {
  sendLogs(context.error)
});
```
- In the error handler you will have access to the whole "context" that caused the error with it's state and the error itself
- The "context" in the error handler is a copy of the "context" that will be return, mutating it will not change the returned value


## Utilities

- **debugFlow**: will help you debug the state of your context (optionally your can pass an array of string to retrieve the value at a given path)
example:
```js
const handler = pipeFlow(
  (context) => {
    return { status: "ok" } // Attach data to the state
  },
  debugFlow() // { input: { id: 9 }, state: { status: "ok" }, error: undefined, return undefined}
)();

handler({ id: 9 });

const handler = pipeFlow(
  (context) => {
    return { status: "ok" } // Attach data to the state
  },
  debugFlow(["state", "status"]) // "ok"
)();

handler({ id: 9 });
```

- **addToReturn**: will add the return value of a given function to the return property
- **addToState**: will add the return value of a given function to the state property
  
```js
const handler = pipeFlow(
  addToReturn(() => { status: "ok" }),
)();

const result = handler(() => { id: 9 });
console.log(result) // { status: "ok" }
```

- **addToReturnOn**: will add the return value on the given key of a given function to the return property
- **addToStateOn**: will add the return value on the given key of a given function to the state property 

```js
const handler = pipeFlow(
  addToReturnOn("status", () => "ok" ),
)();

const result = handler(() => { id: 9 });
console.log(result) // { status: "ok" }
```
## The Flow and it's Context Recap

A *flow* is similar to a pipe function in functional programming, you can combine your functions from left to right, and the *"context"* will flow thought them, what you return from those functions will be attach to the state of the "context" so it can be passed on to the next function of the flow.
Anything you wish to return can be attached to the return entry of the "context".

Those are the keys accessible inside the "context"

- **input**: is the context data you passed to you pipe, it is immutable
- **state**: is a mutable key that you can use to pass data from one function to another
- **error**: you can attach an error to the error key, doing so will bypass other functions of the flow, only the error handler will be trigger. (will be returned from your pipe if any)
- **return**: what will be returned from your pipe


**If you want to pass data from one function to an other you can use the state key**

### Typescript

You will find different types available
```ts
type FlowContext
type FlowMiddleware
```
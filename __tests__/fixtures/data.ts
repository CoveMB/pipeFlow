const pipeContext = {
  isContext: true,
  userId: 42,
  processName: "processor",
} as const;

const pipeState = {
  isState: true,
  user: { age: 42, name: "J" },
} as const;

export { pipeContext, pipeState };

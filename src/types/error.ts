import { FlowBox, FlowBoxWithError } from "./box";

export type FlowError = {
  expose: boolean;
  code: number;
  message: string;
  error?: Error;
};

export type ErrorBuilder = (
  expose?: boolean
) => (code?: number) => (message?: string | Error) => FlowError;

export type ErrorCallback<
  M extends FlowBox = FlowBox,
  X extends FlowError = FlowError
> = (box: FlowBoxWithError<M, X>) => void;

// @internal
export type ErrorCallbackHandler = (
  errorCallback: ErrorCallback
) => (box: Promise<FlowBox>) => Promise<FlowBox>;

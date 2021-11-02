export interface ILogger {
  log(message: any, context?: string): void;
  error(message: any, trace?: string, context?: string): void;
  warn(message: any, context?: string): void;
  setContext(context: string): void;
}

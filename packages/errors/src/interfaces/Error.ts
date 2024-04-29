export interface IError {
  code: string;
  message: string;

  log(message: string): void;
}

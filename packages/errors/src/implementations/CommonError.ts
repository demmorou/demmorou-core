
import { logger } from "@demmorou/logger";
import { IError } from "../interfaces/Error";
import { ErrorProps } from "../interfaces/Props";

export class CommonError implements IError {
  code: string;
  message: string;

  constructor(props: ErrorProps) {
    this.code = props.code;
    this.message = props.message;
  }

  public log(message: string): void {
    logger(message);
  }
}

import winston from "winston";

import { loggerSerializer } from "../serializers";

import { LoggerOptions } from "../interfaces";
import { utilities } from "../utils";

export class Logger {
  private contextLogger: winston.Logger;
  private logger: winston.Logger;
  private context?: string;

  constructor(private options: LoggerOptions) {
    const logFormat = winston.format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
    );

    const parse = winston.format.printf((message) => JSON.stringify(message));

    this.logger = winston.createLogger({
      level: "debug",
      defaultMeta: {
        env: this.options.env,
        app_name: this.options.app_name,
        version: this.options.version,
      },
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.metadata({
          fillExcept: ["message", "level", "timestamp", "label"],
        }),
        winston.format.json()
      ),
      transports: [
        this.options.isDev
          ? new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize({ all: true }),
                logFormat,
                utilities.format.outputLoggerFormat(this.options.app_name, {
                  prettyPrint: true,
                  colors: true,
                })
              ),
            })
          : new winston.transports.Console({
              format: winston.format.combine(parse),
            }),
      ],
    });

    this.contextLogger = this.logger;
  }

  public log(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, level = "info", ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.info(msg);
    }

    if (context) {
      logger = logger.child({ context });
    }

    return logger.info(message);
  }

  public debug(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, level = "info", ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.debug(msg);
    }

    if (context) {
      logger = logger.child(context);
    }

    return logger.debug(message);
  }

  public info(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, level = "info", ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.info(msg);
    }

    if (context && !context?.req && !context?.res) {
      logger = logger.child(context);
    }
    if (context?.req) {
      logger = logger.child({ req: loggerSerializer.req(context.req) });
    }
    if (context?.res) {
      logger = logger.child({ res: loggerSerializer.res(context.res) });
    }

    return logger.info(message);
  }

  public warn(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, level = "info", ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.warn(msg);
    }

    if (context) {
      logger = logger.child(context);
    }

    return logger.warn(message);
  }

  public error(message: any, trace?: any, context?: any): any {
    let logger = this.contextLogger;

    if (message instanceof Error) {
      const { message: msg, name, stack, ...meta } = message;
      context = context || this.context;

      if (meta || trace || context) {
        logger = logger.child({
          ...meta,
          stack: [message.stack || trace],
          name,
          context,
        });
      }

      return logger.error(msg);
    }

    if (typeof message === "object") {
      const { message: msg, name, stack, ...meta } = message;
      context = context || this.context;

      if (meta || trace || context) {
        logger = logger.child({
          ...meta,
          stack: [trace],
          context,
        });
      }

      return logger.error(msg);
    }

    if (trace || context) {
      logger = logger.child({ trace, context });
    }

    return logger.error(message, trace);
  }

  public critical(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.crit(msg);
    }

    if (context) {
      logger = logger.child(context);
    }

    return logger.crit(message);
  }

  public fatal(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, level = "info", ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.emerg(msg);
    }

    if (context) {
      logger = logger.child(context);
    }

    return logger.emerg(message);
  }

  public verbose(message: any, context?: any): any {
    let logger = this.contextLogger;

    if ("object" === typeof message) {
      const { message: msg, level, ...meta } = message;
      context = context || this.context;

      if (meta) {
        logger = logger.child(meta);
      }

      return logger.verbose(msg);
    }

    if ("string" === typeof context) {
      logger = logger.child({ context });
    }

    if ("object" === typeof context) {
      logger = logger.child(context);
    }

    return logger.verbose(message);
  }

  public addContext(data: any): void {
    this.contextLogger = this.contextLogger.child(data);
  }

  public clearContext(): void {
    this.contextLogger = this.logger;
  }

  public setContext(context: string) {
    this.context = context;
  }
}

import { createLogger, format, transports } from "winston";

const options = {
  file: {
    level: "info",
    filename: "logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    timestamp: true
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true
  }
};

const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false,
  format: format.combine(format.colorize(), format.simple())
});

(logger as any).stream = {
  write: (message, _) => logger.info(message)
};

export default logger;

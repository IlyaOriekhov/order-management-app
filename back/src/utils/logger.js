import winston from "winston";

const { combine, timestamp, printf, colorize, align } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const fileFormat = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),

    new winston.transports.File({
      filename: "all.log",
      format: fileFormat,
    }),

    new winston.transports.File({
      filename: "errors.log",
      level: "error",
      format: fileFormat,
    }),
  ],
});

export default logger;

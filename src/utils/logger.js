const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console(), new transports.File({ filename: "logs/combined.log" })]
});

module.exports = logger;

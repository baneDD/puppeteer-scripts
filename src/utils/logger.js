const { createLogger, format, transports } = require("winston");

const logTransports = {
  console: new transports.Console(),
  file: new transports.File({ filename: "logs/combined.log" })
};

const logger = createLogger({
  format: format.simple(),
  transports: [logTransports.console, logTransports.file]
});

if (process.env.ENV === "dev") {
  logTransports.console.level = "debug";
  logTransports.file.level = "debug";
}

module.exports = logger;

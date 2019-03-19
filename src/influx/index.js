const influx = require("./influx");
const logger = require("../utils/logger");

/**
 * Bootstrap the database
 */
const init = async () => {
  try {
    const names = await influx.getDatabaseNames();
    if (names.indexOf("pupeteer") === -1) {
      logger.info("InfluxDB: pupeteer database does not exist. Creating database");
      return influx.createDatabase("pupeteer");
    }
    logger.info("InfluxDB", "pupeteer database already exists. Skipping creation.");
    return Promise.resolve();
  } catch (err) {
    console.log(err);
    return Promise.reject("Failed to initialise influx");
  }
};

/**
 * Insert all key value pairs into the DB
 * @param {String} url - Url from the peroformance data to save
 * @param {*} data - Data to save
 */
const saveData = async (url, data) => {
  try {
    const points = Object.keys(data).reduce((points, key) => {
      if (data[key]) {
        points.push({
          measurement: key,
          tags: { url },
          fields: { value: data[key] }
        });
      }
      return points;
    }, []);

    const result = await influx.writePoints(points);
    logger.info(`Successfully saved pupeteer data for ${url}`);
    return result;
  } catch (err) {
    logger.error(`Failed to save pupeteer data for ${url}`, err);
    return Promise.reject(`Failed to save data into influxdb for ${url}`);
  }
};

module.exports = {
  influx,
  init,
  saveData
};

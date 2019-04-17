const influx = require("./influx");
const logger = require("../utils/logger");

/**
 * Bootstrap the database
 */
const init = async () => {
  try {
    const names = await influx.getDatabaseNames();
    if (names.indexOf("puppeteer") === -1) {
      logger.info("InfluxDB: puppeteer database does not exist. Creating database");
      return influx.createDatabase("puppeteer");
    }
    logger.info("InfluxDB", "puppeteer database already exists. Skipping creation.");
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
const saveData = async (url, data, label, useragent) => {
  const tag = label ? `${url}~${label}` : url;

  try {
    const points = Object.keys(data).reduce((points, key) => {
      if (data[key]) {
        points.push({
          measurement: key,
          tags: { url, label, useragent },
          fields: { value: data[key] }
        });
      }
      return points;
    }, []);

    const result = await influx.writePoints(points);
    logger.info(`Successfully saved puppeteer data for ${tag}`);
    return result;
  } catch (err) {
    logger.error(`Failed to save puppeteer data for ${tag}`, err);
    return Promise.reject(`Failed to save data into influxdb for ${tag}`);
  }
};

module.exports = {
  influx,
  init,
  saveData
};

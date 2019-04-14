const puppeteer = require("puppeteer");
const { urls, cron } = require("./config");
const logger = require("./utils/logger");
const { init, saveData } = require("./influx");
const { CronJob } = require("cron");

const main = async () => {
  if (!urls || urls.length == 0 || !urls[0].url) {
    logger.error("No URLs supplied to process! Exiting...");
    process.exit(1);
  }

  await init();

  try {
    if (cron) {
      return new CronJob(cron, async () => filterOnPlugin(urls).map(item => item.url && getStatsForUrl(item)), null, true, "America/Toronto", null, true);
    }
  } catch (err) {
    logger.error(err);
  }
};

const filterOnPlugin = urls => urls.filter(url => url.plugins && url.plugins.name === "puppeteer-scripts");

const stats = (type, files) => {
  const temp = {};
  temp[`${type}-numberRequested`] = files.length;
  temp[`${type}-numberNotFound`] = files.filter(file => file.status === 404).length;
  temp[`${type}-totalSize`] = files.reduce((acc, cur) => acc + cur.size, 0); // Size in bytes

  return temp;
};

const processForSize = (files, dataReceived) => {
  for (let i = 0; i < files.length; i++) {
    let received = dataReceived.find(file => file.requestId === files[i].requestId);
    if (received) files[i].size = received.encodedDataLength > 0 ? received.encodedDataLength : received.dataLength;
  }
};

const getStatsForUrl = async item => {
  const { url, config } = item;
  const images = [];
  const bundle = [];
  const dataReceived = [];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  if (config.userAgent) {
    page.setUserAgent(userAgent);
  }
  if (config.viewport) {
    page.setViewport(viewport);
  }

  const getPageAndProcessDataReceived = async (page, url, dataReceived, ...collections) => {
    await page.goto(url, { timeout: 0, waitUntil: "networkidle0" });
    collections.forEach(collection => processForSize(collection, dataReceived));
  };

  page.on("request", request => request.continue());

  page._client.on("Network.dataReceived", event => dataReceived.push(event));

  page._client.on("Network.responseReceived", event => {
    const bundleTypes = ["Document", "Font", "Script", "Stylesheet"];
    const eventData = { url: event.response.url, status: event.response.status, requestId: event.requestId, size: 0 };
    if (event.type === "Image") {
      images.push(eventData);
    } else if (bundleTypes.includes(event.type)) {
      bundle.push(eventData);
    }
  });

  await page.setRequestInterception(true);
  await page.setCacheEnabled(false);
  await getPageAndProcessDataReceived(page, url, dataReceived, images, bundle);

  await saveData(url, stats("images", images));
  await saveData(url, stats("bundle", bundle));

  await browser.close();
};

main();

// We only want to export private functions for testing only
if (process.env.ENV === "test") {
  module.exports = { main, filterOnPlugin };
} else {
  module.exports = { main };
}

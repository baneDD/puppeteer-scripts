const puppeteer = require("puppeteer");
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()]
});

const stats = (url, type, files) =>
  new Object({
    url: url,
    type: type,
    numberRequested: files.length,
    numberNotFound: files.filter(file => file.status === 404).length,
    totalSize: files.reduce((acc, cur) => acc + cur.size, 0) // Size in bytes
  });

const processForSize = (files, dataReceived) => {
  for (let i = 0; i < files.length; i++) {
    let received = dataReceived.find(file => file.requestId === files[i].requestId);
    if (received) files[i].size = received.encodedDataLength > 0 ? received.encodedDataLength : received.dataLength;
  }
};

(async args => {
  if (!args || args.length < 3 || typeof args[2] !== "string") {
    logger.error("Please provide a URL to use");
    process.exit(1);
  }

  const url = args[2];
  const images = [];
  const bundle = [];
  const dataReceived = [];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

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

  logger.info(JSON.stringify(stats(url, "images", images), null, 2));
  logger.info(JSON.stringify(stats(url, "bundle", bundle), null, 2));

  await browser.close();

  process.exit(0);
})(process.argv);

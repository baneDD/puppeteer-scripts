const puppeteer = require("puppeteer");
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()]
});

(async args => {
  if (!args || args.length < 3 || typeof args[2] !== "string") {
    logger.error("Please provide a URL to use");
    process.exit(1);
  }

  const url = args[2];
  const images = [];
  const imageDataReceived = [];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  const getPageAndProcessDataReceived = async (page, url, images, imageDataReceived) => {
    await page.goto(url, { timeout: 0, waitUntil: "networkidle0" });

    for (let i = 0; i < images.length; i++) {
      let received = imageDataReceived.find(item => item.requestId === images[i].requestId);
      if (received) images[i].size = received.encodedDataLength > 0 ? received.encodedDataLength : received.dataLength;
    }
  };

  page.on("request", request => request.continue());

  page._client.on("Network.dataReceived", event => imageDataReceived.push(event));

  page._client.on("Network.responseReceived", event => {
    if (event.type === "Image") {
      images.push({ url: event.response.url, status: event.response.status, requestId: event.requestId, size: 0 });
    }
  });

  await page.setRequestInterception(true);
  await page.setCacheEnabled(false);
  await getPageAndProcessDataReceived(page, url, images, imageDataReceived);

  const imageStats = {
    url: url,
    numberRequested: images.length,
    numberNotFound: images.filter(img => img.status === 404).length,
    totalSize: images.reduce((acc, cur) => acc + cur.size, 0)
  };

  logger.info(JSON.stringify(imageStats, null, 2));

  await browser.close();

  process.exit(0);
})(process.argv);

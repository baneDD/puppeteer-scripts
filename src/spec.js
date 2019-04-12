const cron = require("cron");
const { main, filterOnPlugin } = require("./");
const influx = require("./influx");
const config = require("./config");

jest.mock("./influx", () => {
  return {
    init: jest.fn(),
    saveData: jest.fn(() => Promise.resolve())
  };
});

jest.mock("./config", () => {
  return {
    cron: "*/2 * * * *",
    urls: [
      {
        url: "https://www.one.com",
        plugins: [
          {
            name: "puppeteer-scripts"
          }
        ]
      },
      {
        url: "https://www.two.com",
        plugins: [
          {
            name: "lighthouse"
          }
        ]
      },
      {
        url: "https://www.three.com",
        plugins: [
          {
            name: "puppeteer-scripts"
          }
        ]
      }
    ]
  };
});

jest.mock("cron", () => {
  return {
    CronJob: jest.fn()
  };
});

describe("main", () => {
  beforeEach(() => {
    influx.init.mockClear();
    cron.CronJob.mockClear();
  });

  it("calls to bootstrap the influx setup", async () => {
    await main();
    expect(influx.init).toBeCalled();
  });

  it("creates a cron job when cron is enabled", async () => {
    await main();

    const cronJobArgs = cron.CronJob.mock.calls[0];

    const cronValue = cronJobArgs[0];
    const timeZone = cronJobArgs[4];
    const startCronOnLoad = cronJobArgs[6];

    expect(cronValue).toEqual("*/2 * * * *");
    expect(timeZone).toEqual("America/Toronto");
    expect(startCronOnLoad).toEqual(true);
  });

  it("only gets URLs where the 'puppeteer-scripts' plugin is specified", () => {
    const urls = filterOnPlugin(config.urls);

    urls.map(item => expect(item.plugins.find(plugin => plugin.name === "puppeteer-scripts")));
  });
  // TODO: Add tests to test the puppeteer functionality
});

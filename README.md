# Puppeteer Scripts

[![Build Status](https://travis-ci.org/baneDD/puppeteer-scripts.svg?branch=master)](https://travis-ci.org/baneDD/puppeteer-scripts) [![codecov](https://codecov.io/gh/baneDD/puppeteer-scripts/branch/master/graph/badge.svg)](https://codecov.io/gh/baneDD/puppeteer-scripts) [![Plugin Built For: Garie](https://img.shields.io/badge/plugin%20built%20for-garie-blue.svg)](https://github.com/boyney123/garie) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is built as a plugin for [Garie Open Source Web Performance System](https://garie.io/)

These scripts provide useful data about the URLs provided in the config:

- Number of images on the page
- Total size of images on the page
- Number of images not loaded (404s)
- Number of markup, CSS, JS and Font files loaded on the page
- Overall size of the markup, CSS, JS and Font files
- Number of markup, CSS, JS and Font files resulting in 404s

### Config Options

To enable the puppeteer-scripts plugin to run, a plugins object is required for the url object. The plugin object should have `name` property set to `puppeteer-scripts`. Custom configuration can also be passed in to control the puppeteer page options:
  - __userAgent__ <string> Specific user agent to use in this page
  - __wait__ <string> Wait-on string to use for puppeteer `page.waitOn`
  - __viewport__ <Object>
      - `width` <number> page width in pixels. __required__
      - `height` <number> page height in pixels. __required__
      - `deviceScaleFactor` <number> Specify device scale factor (can be thought of as dpr). Defaults to `1`.
      - `isMobile` <boolean> Whether the `meta viewport` tag is taken into account. Defaults to `false`.
      - `hasTouch` <boolean> Specifies if viewport supports touch events. Defaults to `false`.
      - `isLandscape` <boolean> Specifies if viewport is in landscape mode. Defaults to `false`.

### Execution

To execute, simply run `docker run --shm-size 1G puppeteer-scripts`

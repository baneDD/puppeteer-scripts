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

To execute, simply run `docker run --shm-size 1G puppeteer-scripts`

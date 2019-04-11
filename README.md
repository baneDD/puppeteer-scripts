# Pupeteer Scripts

[![Build Status](https://travis-ci.org/baneDD/pupeteer-scripts.svg?branch=master)](https://travis-ci.org/baneDD/pupeteer-scripts)

These scripts provide useful data about the URLs provided in the config:

- Number of images on the page
- Total size of images on the page
- Number of images not loaded (404s)
- Number of markup, CSS, JS and Font files loaded on the page
- Overall size of the markup, CSS, JS and Font files
- Number of markup, CSS, JS and Font files resulting in 404s

To execute, simply run `docker run --shm-size 1G pupeteer-scripts`

const mkdirp = require('mkdirp');
const homedir = require('homedir');
const request = require('request');
const cachedRequest = require('cached-request')(request);

const package = require('./package.json');
const cacheDirectory = `${homedir()}/.lookup/cache`;
const timeToRelease = 1000 * 3600 * 24 * 30;

mkdirp.sync(cacheDirectory);
cachedRequest.setCacheDirectory(cacheDirectory);

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    if (!options.ttl) {
      options.ttl = timeToRelease;
    }

    if (!options.headers) {
      options.headers = {};
    }

    options.headers['User-Agent'] = `${package.name} Version: ${package.version} Author: ${package.author}`;

    cachedRequest(options, (error, response, body) => {
      if (error) {
        reject(error, response);
      } else {
        resolve(body, response);
      }
    });
  });
};

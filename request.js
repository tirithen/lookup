const request = require('request');
const appInfo = require('./package.json');

const defaultTimeout = 5000;

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    if (!options.headers) {
      options.headers = {};
    }

    options.headers['User-Agent'] = `${appInfo.name} ` +
                                    `v${appInfo.version} ` +
                                    `created by ${appInfo.author}`;

    if (!options.timeout) {
      options.timeout = defaultTimeout;
    }

    request(options, (error, response, body) => {
      if (error) {
        reject(error, response);
      } else {
        resolve(body, response);
      }
    });
  });
};

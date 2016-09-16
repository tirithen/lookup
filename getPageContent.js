const striptags = require('striptags');
const unfluff = require('unfluff');
const request = require('./request');

function getPageContent(url, minLength) {
  return new Promise((resolve, reject) => {
    request({ url }).then((body) => {
      try {
        const content = unfluff(body).text;
        if (content.length >= minLength) {
          resolve(striptags(content).trim());
        } else {
          reject(new Error('Unable to extract content'));
        }
      } catch (contentError) {
        reject(contentError);
      }
    }, reject);
  });
}

module.exports = getPageContent;

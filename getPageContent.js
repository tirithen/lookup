const striptags = require('striptags');
const unfluff = require('unfluff');
const request = require('./request');

function getPageContent(url) {
  console.log('getPageContent', url)
  return new Promise((resolve, reject) => {
    request({ url }).then((body) => {
console.log('resp', url, body)
      try {
        const content = unfluff(body).text;
        if (content.length > 0) {
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

module.export = getPageContent;

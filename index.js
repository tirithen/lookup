#!/usr/bin/env node

const getDuckDuckGoSearchHits = require('./getDuckDuckGoSearchHits');
const getPageContent = require('./getPageContent');


function getQuery() {
  return process.argv.slice(2).join(' ');
}

function getDescription(query) {
  return new Promise((resolve, reject) => {
    getDuckDuckGoSearchHits(query).then((results) => {
console.log(results);
      function getNext(index) {
        console.log('getNext', index);
        getPageContent(results[index]).then(
          (content) => {
            console.log(`Found result on ${results[index].url}`);
            resolve(content);
          },
          (error) => {
            console.log('err', error);
            if (index < results.length) {
              getNext(index + 1);
            } else {
              reject(error);
            }
          }
        );
      }
      getNext(0);
    }, reject);
  });
}

const query = getQuery();
console.log(`Looking up ${query}...`);
getDescription(query).then((description) => {
  console.log(`\n${description}`);
  process.exit(0);
}, (error) => {
  console.error(`There was an error when looking up ${query} :(`);
  console.error(error);
  process.exit(1);
});

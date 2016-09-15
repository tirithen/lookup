#!/usr/bin/env node

const request = require('request');
const unfluff = require('unfluff');
const striptags = require('striptags');

function getQuery() {
  return process.argv.slice(2);
}

function getSearchHits(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.duckduckgo.com/?format=json&pretty=1&q=${encodeURIComponent(query)}`;
    request(url, (error, responce, body) => {
      if (error) {
        reject(error);
      } else {
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

function getPageContent(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      console.log(body)
      if (error) {
        reject(error);
      } else {
        try {
          resolve(striptags(unfluff(body)).trim());
        } catch (contentError) {
          reject(contentError);
        }
      }
    });
  });
}

function getDescription(query) {
  return new Promise((resolve, reject) => {
    getSearchHits(query).then((searchResult) => {
      function resolveIfContent(text) {
        const result = text.trim();
        if (result.length > 0) {
          resolve(result);
        } else {
          reject(new Error('Unable to extract useful content'));
        }
      }

      let description = '';

      if (searchResult.Abstract) {
        description += `${striptags(searchResult.Abstract).trim()}\n\n`;
      }

      if (searchResult.AbstractURL) {
        getPageContent(searchResult.AbstractURL).then((content) => {
          description += `${content}\n\n`;
          resolveIfContent(description);
        }, reject);
      } else {
        resolveIfContent(description);
      }
    }, reject);
  });
}

const query = getQuery();
console.log(`Looking up ${query}...`);
getDescription(query).then((description) => {
  console.log(description);
  process.exit(0);
}, () => {
  console.error(`There was an error when looking up ${query} :(`);
  process.exit(1);
});

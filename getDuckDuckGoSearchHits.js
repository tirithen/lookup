const cheerio = require('cheerio');
const domainBlacklist = require('./domainBlacklist');
const request = require('./request');
const SearchResult = require('./SearchResult');

function getDuckDuckGoSearchHits(query) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://duckduckgo.com/html',
      form: { q: query }
    }).then((body) => {
      try {
        const $ = cheerio.load(body);
        const results = [];

        $('#links .result').each((index, html) => {
          const $html = $(html);
          const result = new SearchResult(
            $html.find('.result__a').attr('href'),
            $html.find('.result__a').text(),
            $html.find('.result__snippet').text()
          );

          let blacklisted = false;
          domainBlacklist.forEach((domain) => {
            if (!blacklisted && result.url.indexOf(domain) !== -1) {
              blacklisted = true;
            }
          });

          if (!blacklisted && result.isComplete()) {
            results.push(result);
          }
        });

        if (results.length > 0) {
          resolve(results);
        } else {
          reject(new Error('Did not find any results'));
        }
      } catch (parseError) {
        reject(parseError);
      }
    }, reject);
  });
}

module.exports = getDuckDuckGoSearchHits;

#!/usr/bin/env node

const colors = require('colors');
const lookup = require('./lookup');

function getQuery() {
  return process.argv.slice(2).join(' ');
}

const query = getQuery();

console.log(colors.bold(colors.white(
  `Looking up ${colors.yellow(query)}...`
)));

lookup(query).then((result) => {
  console.log(colors.bold(colors.white(
    `Found result on ${colors.blue(result.url)}`
  )));
  console.log(`\n${result.content}`);
  process.exit(0);
}, (error) => {
  console.error(colors.bold(colors.red(
    `There was an error when looking up ${colors.yellow(query)} :(`
  )));
  console.error(error);
  process.exit(1);
});

"use strict";
const chalk = require("chalk");
const b = chalk.blue.bind(chalk);
const g = chalk.green.bind(chalk);
const gr = chalk.gray.bind(chalk);
const m = chalk.magenta.bind(chalk);
const r = chalk.red.bind(chalk);
const y = chalk.yellow.bind(chalk);
const heading = function(text) {
  return chalk.underline(`\n${text.toUpperCase()}\n`);
}


module.exports = {
  b,
  g,
  gr,
  heading,
  m,
  r,
  y,
};

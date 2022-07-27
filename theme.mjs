const chalk = await import("chalk");
export const b = chalk.default.blue.bind(chalk);
export const g = chalk.default.green.bind(chalk);
export const gr = chalk.default.gray.bind(chalk);
export const m = chalk.default.magenta.bind(chalk);
export const r = chalk.default.red.bind(chalk);
export const y = chalk.default.yellow.bind(chalk);
export const heading = function (text) {
  return chalk.default.underline(`\n${text.toUpperCase()}\n`);
};

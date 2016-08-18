"use strict";
const chalk = require("chalk");
const b = chalk.blue.bind(chalk);
const g = chalk.green.bind(chalk);
const gr = chalk.gray.bind(chalk);
const m = chalk.magenta.bind(chalk);
const r = chalk.red.bind(chalk);
const y = chalk.yellow.bind(chalk);

const wicgURL = chalk.blue.underline.bold("https//wicg.io");
const wicgTitle = chalk.yellow("Web Incubator Community Group");
const W3C = `${gr(">--=")} ${b("W")} * ${gr("3")} * ${b("C")} ${gr("=--<")}`;
const YOLO = `
    ${y(" __      __")}${r(".___")}${m("_________")}${g("   ________")}        ${W3C}
    ${y("/  \\    /  \\")}${r("   \\")}${m("_   ___ \\")}${g(" /  _____/")}
    ${y("\\   \\/\\/   /")}${r("   /")}${m("    \\  \\/")}${g("/   \\  ___")}   ${wicgTitle}
    ${y(" \\        /")}${r("|   \\")}${m("     \\___")}${g("\\    \\_\\  \\")}
    ${y("  \\__/\\  /")}${r(" |___|")}${m("\\______  /")}${g("\\______  /")}         ${wicgURL}
    ${y("       \\/")}              ${m("\\/")}        ${g("\\/")}
`;

module.exports = {
  b,
  g,
  gr,
  m,
  r,
  y,
  YOLO,
};

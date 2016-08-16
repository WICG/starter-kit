#!/usr/bin/env node
"use strict";
const program = require("commander");
const chalk = require("chalk");
const path = require("path");
const async = require("marcosc-async");
const fs = require("fs-promise");

// Templates
const tmplDir = __dirname + "/templates/";

const init = async(function*() {
  const dirFiles = yield fs.readdir(tmplDir);
  const destinations = dirFiles
    .map(filename => ({
      from: tmplDir + filename,
      to: `${process.cwd()}/${filename}`
    }));
  for (let { from, to } of destinations) {
    const exists = yield fs.exists(to);
    if (exists) {
      console.warn("Skipping:", path.basename(to));
      continue;
    }
    const data = yield fs.readFile(from, "utf8");
    yield fs.writeFile(to, data);
  }
});

const readVersionNumber = async(function*() {
  var data = yield fs.readFile(__dirname + "/package.json");
  return JSON.parse(data).version;
});

readVersionNumber().then((version) => {
  program
    .version(version)
    .option("-i, init", "start a new incubation project", () => {
      init().catch(err => console.error(err));
    })
    .parse(process.argv);
});

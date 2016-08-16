#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const async = require('marcosc-async');
const fs = require('fs-promise');

// Templates
const tmplDir = __dirname + "/templates/";

const init = async(function*() {
  const dirFiles = yield fs.readdir(tmplDir);
  const destinations = dirFiles
    .map(filename => ({
      from: tmplDir + filename,
      to: `${process.cwd()}/${filename}`
    }));
  for (let { from, to }
    of destinations) {
    const data = yield fs.readFile(from, 'utf8');
    yield fs.writeFile(to, data);
  }
});


program
  .option('-i, init [project-name]', 'start a new incubation project', (name) => {
    console.log("name>",name)
    init().catch(err => console.error(err))
  })
  .parse(process.argv);

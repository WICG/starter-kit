#!/usr/bin/env node

"use strict";
const async = require("marcosc-async");
const chalk = require("chalk");
const fs = require("fs-promise");
const git = require("./git");
const path = require("path");
const program = require("commander");
const prompt = require("prompt");
const tmplDir = __dirname + "/templates/";

// Colors + YOLO (WICG Logo)
const { b, g, gr, r, y, YOLO } = require("./theme.js");

// Reads version number from package.json
const readVersionNumber = async(function*() {
  var data = yield fs.readFile(__dirname + "/package.json");
  return JSON.parse(data).version;
});

// Uses git to get the name of the repo (cwd)
const getRepoName = async(function*() {
  const name = yield git("rev-parse --show-toplevel");
  return path.basename(name).trim();
});

// User prompt tasks
const Prompts = {
  askQuestion(promptOps) {
    return new Promise((resolve, reject) => {
      prompt.get(promptOps, (err, res) => {
        if (err) {
          return reject(new Error(" 🙅 User canceled."));
        }
        resolve(res.question);
      });
    });
  },
  askRepoName() {
    const promptOps = {
      description: "What will this Git repository be called?",
      pattern: "[^\s]",
      message: "Spaces are pro",
      default: path.basename(process.cwd()),
    };
    return this.askQuestion(promptOps);
  },
  askProjectName(repo) {
    const promptOps = {
      description: "What's the name of this project?",
      default: `The ${repo.charAt(0).toUpperCase() + repo.slice(1)} API`,
    };
    return this.askQuestion(promptOps);
  },
  askUserName() {
    return async.task(function*() {
      let gitUser;
      try {
        gitUser = yield git("config user.name");
      } catch (err) {
        gitUser = "";
      }
      const promptOps = {
        description: "Who edits the spec (using your git user name)?",
        default: gitUser.trim(),
      };
      return yield this.askQuestion(promptOps);
    }, this);
  },
};

// Tell the user what they should do next.
const postInitialization = async(function*() {
  console.info(chalk.underline("NEXT STEPS"));
  console.info(`
Congrats! you are ready to go. Please review the files that
were just added to this directory.

If you are new to spec writing, we strongly encourage you to read:

  ⭐️ API Design Principles:
    ${b("https://w3ctag.github.io/design-principles/")}

  ⭐️ Writing Promise-Using Specs:
    ${b("http://www.w3.org/2001/tag/doc/promises-guide")}

  `);
});

const getProjectDetails = async(function*(name = "") {
  let repo;
  try {
    repo = yield getRepoName();
    console.info(b("Repository:"), repo);
  } catch (err) {
    repo = yield Prompts.askRepoName();
  }

  // Let's get the name of the project
  if (!name) {
    name = yield Prompts.askProjectName(repo);
  }

  // Derive the user's name from git config
  const userName = yield Prompts.askUserName();

  console.info("\n");
  return {
    name,
    repo,
    userName,
  };
});

const writeTemplates = async(function*({ repo, name, userName }) {
  console.info(chalk.underline("CREATING TEMPLATES\n"));
  const dirFiles = yield fs.readdir(tmplDir);
  const destinations = dirFiles.map(
    filename => ([tmplDir + filename, `${process.cwd()}/${filename}`])
  );
  for (let [from, to] of destinations) {
    const exists = yield fs.exists(to);
    if (exists) {
      console.warn(`${y(" => Skipping")} ${gr(path.basename(to))} (already exists)`);
      continue;
    }
    const rawData = yield fs.readFile(from, "utf8");
    const data = rawData
      .replace(/{{name}}/g, name)
      .replace(/{{repo}}/g, repo)
      .replace(/{{userName}}/g, userName);
    try {
      yield fs.writeFile(to, data);
      console.log(`${g(" => Created")} ${gr(path.basename(to))}`);
    } catch (err) {
      console.error(`${r(" => Error! ")} could not create ${gr(path.basename(to))}`);
    }
  }
  console.log("\n");
});

readVersionNumber().then((version) => {
  program
    .version(version);

  program
    .command("init [name]")
    .description("start a new incubation project")
    .action((name, options) => {
      console.info(YOLO);
      getProjectDetails(name, options)
        .then(writeTemplates)
        .then(postInitialization)
        .catch(err => console.error(`\n${r(err.message)}`));
    });

  program.parse(process.argv);
  if (!process.argv.slice(2).length) {
    program.outputHelp();
    console.log(`
  Tool to help you get set up for writing WICG specs.
  More info at: https://wicg.io | bugs: https://github.com/WICG/starter-kit

  Example:

    wicg init "My Awesome API"
    `)
  }
});

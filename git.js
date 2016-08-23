"use strict";
const exec = require("child_process").exec;
const path = require("path");
const async = require("marcosc-async");

function toExecPromise(cmd, timeout) {
  if (!timeout) {
    timeout = 60000;
  }
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Command took too long: ${cmd}`));
      proc.kill("SIGTERM");
    }, timeout);
    const proc = exec(cmd, (err, stdout) => {
      clearTimeout(id);
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

function git(cmd) {
  return toExecPromise(`git ${cmd}`);
}

git.getCurrentBranch = async(function*() {
  const branch = yield git(`rev-parse --abbrev-ref HEAD`);
  return branch.trim();
});

git.getConfigData = async(function*(configItem) {
  let data;
  try {
    data = yield git(configItem);
  } catch (err) {
    data = "";
  }
  return data;
});

git.getBranches = async(function*() {
  const rawBranches = yield git("branch --no-color");
  const branches = rawBranches
    .split("\n")
    .map(branch => branch.replace("*", "").trim())
    .reduce((collector, branch) => collector.add(branch), new Set());
  return Array.from(branches);
});

git.hasBranch = async(function*(branch) {
  const branches = yield git.getBranches();
  return branches.includes(branch);
});

git.switchBranch = async(function*(branch) {
  const hasBranch = yield git.hasBranch(branch);
  if (!hasBranch) {
    yield git(`checkout -b ${branch}`);
  } else {
    yield git(`checkout ${branch}`);
  }
});

git.getRepoName = async(function*() {
  const name = yield git("rev-parse --show-toplevel");
  return path.basename(name).trim();
});

module.exports = git;

"use strict";
const exec = require("child_process").exec;

function toExecPromise(cmd, timeout) {
  if (!timeout) {
    timeout = 40000;
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

module.exports = git;
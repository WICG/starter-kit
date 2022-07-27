"use strict";
import { exec }  from "child_process";
import path from "path";

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

export function git(cmd) {
  return toExecPromise(`git ${cmd}`);
}

git.getCurrentBranch = async () => {
  const branch = await git(`rev-parse --abbrev-ref HEAD`);
  return branch.trim();
};

git.getConfigData = async (configItem) => {
  let data;
  try {
    data = await git(configItem);
  } catch (err) {
    data = "";
  }
  return data;
};

git.getBranches = async () => {
  const rawBranches = await git("branch --no-color");
  const branches = rawBranches
    .split("\n")
    .map((branch) => branch.replace("*", "").trim())
    .reduce((collector, branch) => collector.add(branch), new Set());
  return Array.from(branches);
};

git.hasBranch = async (branch) => {
  const branches = await git.getBranches();
  return branches.includes(branch);
};

git.switchBranch = async (branch) => {
  const hasBranch = await git.hasBranch(branch);
  if (!hasBranch) {
    await git(`checkout -b ${branch}`);
  } else {
    await git(`checkout ${branch}`);
  }
};

git.getRepoName = async () => {
  const name = await git("rev-parse --show-toplevel");
  return path.basename(name).trim();
};

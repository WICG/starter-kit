"use strict";
import { git } from "./git.mjs";
import path from "path";
import prompt from "prompt";

// Configure prompt
prompt.message = " 👉 ";
prompt.delimiter = "";

// Utility function to convert first letter to uppercase.
function upperCaseFirstLetter(word) {
  if (typeof word !== "string") {
    throw new TypeError("Expected string");
  }
  if (!word) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// User prompt tasks
export const Prompts = {
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
      description: "Name of Git repository:",
      default: path.basename(process.cwd()),
      type: "string",
      before(value) {
        return value.trim();
      },
    };
    return this.askQuestion(promptOps);
  },
  askProjectName(repo) {
    const promptOps = {
      description: "Name of project:",
      default: `The ${upperCaseFirstLetter(repo)} API`,
      type: "string",
      before(value) {
        return value.trim();
      },
    };
    return this.askQuestion(promptOps);
  },
  async askUserName() {
    const user = await git.getConfigData("config user.name");
    const promptOps = {
      description: "Name of Primary Editor of the spec:",
      default: user.trim(),
      type: "string",
      before(value) {
        return value.trim();
      },
    };
    return this.askQuestion(promptOps);
  },
  askAffiliation(hint = "") {
    const promptOps = {
      description: `Company affiliation(e.g., ${
        upperCaseFirstLetter(hint) || "Monsters"
      } Inc.):`,
      default: upperCaseFirstLetter(hint),
      type: "string",
      before(value) {
        return value.trim();
      },
    };
    return this.askQuestion(promptOps);
  },
  askAffiliationURL(emailHint = "") {
    const [, hint] = emailHint.match(/(?:@)(.+)/);
    const promptOps = {
      description: "Company URL:",
      type: "string",
      before(value) {
        return value.trim();
      },
    };
    if (hint) {
      promptOps.default = `https://${hint}`;
    }
    return this.askQuestion(promptOps);
  },
  async askEmail() {
    const email = await git.getConfigData("config user.email");
    const promptOps = {
      description: "Email (optional):",
      default: email.trim(),
      type: "string",
    };
    return this.askQuestion(promptOps);
  },
  askWhichGitBranch() {
    const promptOps = {
      description: "Main git branch for the spec:",
      default: "main",
      pattern: /^[\w\-]+$/,
      type: "string",
      message: "Name must be only letters and dashes",
      before(value) {
        return value.trim();
      },
    };
    return this.askQuestion(promptOps);
  },
  askWhichPreProcessor() {
    const promptOps = {
      description: "Spec preprocessor (respec or bikeshed):",
      default: "respec",
      type: "string",
      pattern: /^(respec|bikeshed|bs)$/i,
      before(value) {
        return value.trim().toLowerCase();
      },
    };
    return this.askQuestion(promptOps);
  },
};

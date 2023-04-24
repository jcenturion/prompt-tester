import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import YAML from "yaml";

const { pass, fail, runner } = require("@tunnckocore/create-jest-runner");

import { runner as yamlRunner } from "./runner";
import { YAMLTestSuite } from "./types";

dotenv.config();

process.env.NODE_ENV = "test";

module.exports = runner("@snel/prompt-tester", async (ctx: any) => {
  const { testPath } = ctx;
  const dirname = path.dirname(testPath);
  const basename = path.basename(testPath).replace(".test.yml", ".yml");
  const testFile = fs.readFileSync(testPath, "utf8");
  const testSuite = YAML.parse(testFile) as YAMLTestSuite;
  const defaultTemplatePath = path.join(dirname, basename);

  if (!testSuite.template_path) {
    testSuite.template_path = defaultTemplatePath;
  }

  testSuite.suiteName = basename;

  const results = await yamlRunner(testSuite, pass, fail);

  return results;
});

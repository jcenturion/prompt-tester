import fs from "fs";
import path from "path";
import YAML from "yaml";
import { assert } from "./assert";
import { Assertion, MatcherContext, PromptTemplateBase } from "./types";

export const loadTemplate = (testPath: string, context: MatcherContext): PromptTemplateBase => {
  const dirname = path.dirname(testPath);
  const basename = path.basename(testPath).replace(".test.js", ".yml").replace(".test.ts", ".yml");
  let prompt = context.promptTemplate;
  let templatePath = path.join(dirname, basename);

  if (context.templatePath) {
    templatePath = path.resolve(dirname, context.templatePath);
  }

  try {
    const testFile = fs.readFileSync(templatePath, "utf8");
    prompt = YAML.parse(testFile) as PromptTemplateBase;
  } catch (err) {
    throw new Error(`prompt-tester: "${templatePath}" was not found.`);
  }

  return prompt as PromptTemplateBase;
};

export const ensureTemplateIsValid = (prompt: PromptTemplateBase, assertion: Assertion) => {
  assert(Object.keys(prompt).length > 0, `prompt-tester: "prompt" is empty.`);

  assert(
    prompt.input_variables.length === Object.keys(assertion.variables || {}).length,
    "prompt-tester: number of input variables does not match."
  );
};

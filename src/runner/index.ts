import { TiktokenModel } from "@dqbd/tiktoken";

import { Assertion, LLMParams, PromptTemplateBase, TestStatus, YAMLTestSuite } from "../types";
import { ensureTemplateIsValid } from "../utils";
import { readTemplate } from "./read-template";
import { runTest } from "./run-test";

export async function runner(
  { model_names, temperature, max_tokens, tests, template_path, suiteName }: YAMLTestSuite,
  pass: any,
  fail: any
): Promise<any[]> {
  const { template, input_variables } = readTemplate(template_path);
  const results = [];

  for (const modelName of model_names) {
    for (const [index, testCase] of tests.entries()) {
      const prompt: PromptTemplateBase = {
        template,
        input_variables,
      };
      const llmParams: LLMParams = {
        maxTokens: max_tokens,
        modelName: modelName as TiktokenModel,
        temperature,
      };
      const assertion: Assertion = {
        expectedOutput: testCase.expected_output,
        variables: testCase.variables,
      };
      const testName = testCase.name ? testCase.name : `${suiteName} test#${index}`;

      ensureTemplateIsValid(prompt, assertion);

      const result = await runTest(llmParams, prompt, assertion, template_path, testName);

      results.push(result.status === TestStatus.passed ? pass(result) : fail(result));
    }
  }

  return results;
}

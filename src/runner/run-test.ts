import { encoding_for_model } from "@dqbd/tiktoken";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

import { assert } from "../assert";
import { compare } from "../compare";
import { Assertion, LLMParams, OutputType, PromptTemplateBase, TestResult, TestStatus } from "../types";

export async function runTest(
  { maxTokens, modelName, temperature }: LLMParams,
  { template, input_variables: inputVariables }: PromptTemplateBase,
  assertion: Assertion,
  template_path?: string,
  testName?: string
): Promise<TestResult> {
  assert(!!process.env.OPENAI_API_KEY, "prompt-tester: `OPENAI_API_KEY` is not set in .env file.");

  const encodingModel = encoding_for_model(modelName as any);
  const start = Date.now();

  const llm = new OpenAI({
    modelName,
    maxTokens,
    temperature,
  });

  const promptTemplate = new PromptTemplate({
    template,
    inputVariables,
  });

  const llmChain = new LLMChain({
    prompt: promptTemplate,
    llm,
  });

  const predictResult = (await llmChain.predict(assertion.variables)).trim();
  const [comparisonResult, errorMessage] = await compare(predictResult as OutputType, assertion.expectedOutput);
  const evalPrompt = await promptTemplate.format(assertion.variables);
  const tokens = encodingModel.encode(evalPrompt).length;
  const title = `${testName} (${modelName}) (${tokens} tokens)`;
  const end = Date.now();

  if (comparisonResult) {
    return {
      status: TestStatus.passed,
      start,
      end,
      test: { path: template_path, title },
    };
  } else {
    return {
      status: TestStatus.failed,
      start,
      end,
      test: {
        path: template_path,
        errorMessage: `${errorMessage} (${modelName}) (${tokens} tokens)`,
        title,
      },
    };
  }
}

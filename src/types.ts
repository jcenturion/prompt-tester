import { TiktokenModel } from "@dqbd/tiktoken";

export enum OutputType {
  regex = "regex",
  string = "string",
  yaml = "yaml",
  prompt = "prompt",
}

export enum TestStatus {
  passed = "passed",
  failed = "failed",
}

export type MatcherContext = {
  templatePath?: string;
  promptTemplate: PromptTemplateBase;
  assertion: Assertion;
  llmParams: LLMParams;
};

// NOTE: Using "_" for compatibility with YAML definition
export type PromptTemplateBase = {
  template: string;
  input_variables: string[];
  output_key?: string;
};

export type InputVariables = {
  [key: string]: any;
};

export type LLMParams = {
  modelName?: TiktokenModel;
  temperature?: number;
  maxTokens?: number;
};

export type ExpectedOutput = {
  value: any;
  type?: OutputType;
  model?: string;
};

export type Assertion = {
  variables: InputVariables;
  expectedOutput: ExpectedOutput;
};

export type TestResult = {
  status: TestStatus;
  start: number;
  end: number;
  test: {
    title: string;
    path?: string;
    errorMessage?: string;
  };
};

export type YAMLTestItem = {
  variables: Record<string, any>;
  expected_output: ExpectedOutput;
  name: string;
};

export type YAMLTemplate = {
  template: string;
  input_variables: string[];
  output_key: string;
};

export type YAMLTestSuite = {
  model_names: string[];
  temperature: number;
  max_tokens: number;
  template_path: string;
  tests: YAMLTestItem[];
  suiteName?: string;
};

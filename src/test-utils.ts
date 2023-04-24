import { InputVariables, LLMParams, MatcherContext, OutputType } from "./types";

import "./matcher";

export const prepareTemplate = (templatePath?: string) => {
  const context: MatcherContext = {
    templatePath,
    promptTemplate: {
      input_variables: [],
      template: "",
    },
    assertion: {
      expectedOutput: {
        value: "",
        type: OutputType.string,
      },
      variables: {},
    },
    llmParams: {
      modelName: "text-davinci-003",
      maxTokens: 30,
      temperature: 0,
    },
  };

  const dsl = {
    setLLMParams: (llmParams: LLMParams) => {
      context.llmParams.modelName = llmParams.modelName || "text-davinci-003";
      context.llmParams.temperature = llmParams.temperature || 0;
      context.llmParams.maxTokens = llmParams.maxTokens || 30;
      return dsl;
    },
    setInputVariables: (variables?: InputVariables) => {
      context.assertion.variables = variables || {};
      return context;
    },
  };

  return dsl;
};

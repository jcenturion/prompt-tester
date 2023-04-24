import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as yaml from "yaml";
import { ExpectedOutput } from "../../types";

const conditionsOnTextTemplate = `Validate if the provided input text:
\`\`\`
{input_text}
\`\`\`
meets the following conditions: {conditions}.
Provide the pass result for all conditions and for each condition
provide a pass value (true/false) in YAML format, along with an error message if the condition is not met.
Error messages should be as succint as possible.
Ensure your response is YAML and matches the structure below: one top level object with two keys: "pass" and "conditions".
\`\`\`yaml
pass: false
conditions:
  - condition: at least 8 characters
    pass: false
    error_message: The input text is less than 8 characters.
  - condition: contains at least one uppercase letter
    pass: true
  - condition: contains at least one lowercase letter
    pass: true
  - condition: contains at least one number
    pass: true
\`\`\`
`;

export default async (output: string, expectedOutput: ExpectedOutput): Promise<[boolean, string | null]> => {
  const model = expectedOutput.model!;
  const llm = new OpenAI({
    modelName: model,
    temperature: 0,
    maxTokens: 1800,
  });
  const outValue = expectedOutput.value;

  const params = {
    input_text: output,
    conditions: outValue.conditions,
  };

  const promptTemplate = new PromptTemplate({
    template: conditionsOnTextTemplate,
    inputVariables: ["input_text", "conditions"],
  });

  const llmChain = new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: "validation_result",
  });

  const validationResult = (await llmChain.predict(params)).trim();

  try {
    const validationResultYaml = yaml.parse(validationResult);
    const overallPass = validationResultYaml.pass || false;
    const status = overallPass === true;
    const result = !status
      ? `The output should meet with the following conditions: "${JSON.stringify(outValue.conditions, null, 2)}."`
      : null;
    return [status, result];
  } catch (error: any) {
    if (error instanceof yaml.YAMLError) {
      return [false, error.message];
    } else {
      throw error;
    }
  }
};

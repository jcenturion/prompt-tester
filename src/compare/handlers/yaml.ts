import * as yaml from "yaml";
import { ExpectedOutput } from "../../types";

export default (output: string, expectedOutput: ExpectedOutput): [boolean, string | null] => {
  try {
    const outputYaml = yaml.parse(output);
    const expectedYaml = yaml.parse(expectedOutput.value);
    return [outputYaml === expectedYaml, null];
  } catch (error: any) {
    if (error instanceof yaml.YAMLError) {
      return [false, error.message];
    } else {
      throw error;
    }
  }
};

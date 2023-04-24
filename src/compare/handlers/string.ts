import { ExpectedOutput } from "../../types";

export default (output: string, expectedOutput: ExpectedOutput): [boolean, string | null] => {
  const status = output === expectedOutput.value;
  const result = !status ? `Expected "${expectedOutput.value}" but got "${output}"` : null;
  return [status, result];
};

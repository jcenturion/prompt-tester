import { ExpectedOutput } from "../../types";

export default (output: string, expectedOutput: ExpectedOutput): [boolean, string | null] => {
  const pattern = new RegExp(expectedOutput.value);
  return [pattern.test(output), null];
};

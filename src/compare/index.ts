import { ExpectedOutput, OutputType } from "../types";
import handlers from "./handlers";

export async function compare(output: OutputType, expectedOutput: ExpectedOutput): Promise<[boolean, string | null]> {
  const outputType = expectedOutput.type || "string";
  const typeHandler = handlers[outputType];

  if (!typeHandler) {
    return [false, null];
  }

  return typeHandler(output, expectedOutput);
}

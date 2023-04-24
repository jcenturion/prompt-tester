import * as dotenv from "dotenv";

import { runTest } from "./runner/run-test";
import { ExpectedOutput, MatcherContext } from "./types";
import { ensureTemplateIsValid, loadTemplate } from "./utils";

dotenv.config();

interface CustomMatchers<R = unknown> {
  toMatchOutput(expectedOutput?: Partial<ExpectedOutput> | Array<Partial<ExpectedOutput>> | undefined): Promise<R>;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

expect.extend({
  async toMatchOutput(context: MatcherContext, { value, type }: ExpectedOutput) {
    context.promptTemplate = loadTemplate(this.testPath!, context);
    context.assertion.expectedOutput = { value, type };

    ensureTemplateIsValid(context.promptTemplate, context.assertion);

    const result = await runTest(context.llmParams, context.promptTemplate, context.assertion);

    if (result.status === "passed") {
      return {
        message: () => result.test.title,
        pass: true,
      };
    } else {
      return {
        message: () => result.test.errorMessage!,
        pass: false,
      };
    }
  },
});

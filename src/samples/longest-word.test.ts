import { describe, test } from "@jest/globals";

import { prepareTemplate } from "../test-utils";

describe("Longest Word", () => {
  test(`should identify "longest" as longest world`, async () => {
    const prompt = prepareTemplate().setInputVariables({
      text: "the longest word in this text is longest",
    });

    await expect(prompt).toMatchOutput({ value: "longest" });
  });

  test(`should identify "confusing" as longest world`, async () => {
    const prompt = prepareTemplate("longestWord.yml").setInputVariables({
      text: "the longest word in this text is confusing",
    });

    await expect(prompt).toMatchOutput({ value: "confusing" });
  });
});

# Prompt tester

> Port from [promptest](https://github.com/dschenkelman/promptest).

`@snel/prompt-tester` is a set of tools to help test prompts with language models (LLMs) using [JEST](https://jestjs.io/).

## Installation
To install `@snel/prompt-tester`, run the following command:
```bash
npm install git+https://github.com/jcenturion/prompt-tester
```

## Usage

Make the OpenAI API key available as an environment variable:
```bash
export OPENAI_API_KEY=sk-...
```

**Note**: `@snel/prompt-tester` will automatically read `.env` if present.

To use `@snel/prompt-tester`, add the following config to your `jest.config.js` file:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  projects: [
    // support for YAML tests
    {
      displayName: "prompt-tester",
      runner: "@snel/prompt-tester/jest-runner",
      testMatch: ["**/?(*.)+(spec|test).(yml)"],
      moduleFileExtensions: ["yml"],
    },
    // support for TS tests
    {
      displayName: "prompt-tester",
      testMatch: ["**/?(*.)+(spec|test).(js)"],
      moduleFileExtensions: ["js"],
    },
  ],
};
```

## Examples
Here are a few examples of how to use ` @snel/prompt-tester` to test LLM prompts. Check out [samples](https://github.com/jcenturion/prompt-tester/tree/main/src/samples) folder for more.

## Sample

### Test output with exact match

1. Create a YAML file `prompt.yaml` containing the template for your LLM:
    ```yaml
    template: |
        Provide the longest word in terms of characters in an input piece of text.
        Only provide the word, no other text.
        Provide the word exactly as written in the text, do not modify it, capitalize it, etc.

        The text is:
        {text}
    input_variables:
        - text
    output_key: longest_word
    ```

2. Create a YAML file `prompt.test.yaml` containing the inputs for your tests:
    ```yaml
    model_names:
      - text-davinci-003
    temperature: 0
    max_tokens: 30
    tests:
      - variables:
          text: the longest word in this text is longest
        expected_output:
          type: string
          value: longest
      - variables:
          text: the longest word in this text is confusing
        expected_output:
          type: string
          value: confusing
    ```

    or create a JS file `prompt.test.js`:
    ```javascript
    const { prepareTemplate } =  require("@snel/prompt-tester/test-utils");

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
    ```    

## Running tests
Run the following command to test the prompt templates:
```bash
npm test
```

## License

`@snel/prompt-tester` is released under the [MIT License](https://opensource.org/licenses/MIT).

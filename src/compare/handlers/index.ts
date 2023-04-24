import promptHandler from "./prompt";
import regexHandler from "./regex";
import stringHandler from "./string";
import yamlHanlder from "./yaml";

export default {
  prompt: promptHandler,
  string: stringHandler,
  regex: regexHandler,
  yaml: yamlHanlder,
};

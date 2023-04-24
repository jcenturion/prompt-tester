import fs from "fs";
import YAML from "yaml";
import { YAMLTemplate } from "../types";

export function readTemplate(template_path: string): YAMLTemplate {
  const templateFile = fs.readFileSync(template_path, "utf8");
  const template = YAML.parse(templateFile);

  return template;
}

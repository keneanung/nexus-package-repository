import fs from "fs";
import YAML from "yaml";
import fetch from "node-fetch";

const file = fs.readFileSync("./packages.yaml", "utf8");
const packages = YAML.parse(file);

const repository = [];

for (const [name, url] of Object.entries(packages)) {
  const packageResponse = await fetch(url);
  const packageJson = await packageResponse.json();
  repository.push({
    name,
    packageName: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    url,
    dependencies: packageJson.dependencies || [],
  });
}

fs.writeFileSync("public/repository.json", JSON.stringify(repository));

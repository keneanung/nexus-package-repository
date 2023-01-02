import fs from "fs";
import YAML from "yaml";
import fetch from "node-fetch";
import crypto from "crypto";

const file = fs.readFileSync("./packages.yaml", "utf8");
const packages = YAML.parse(file);

const repository = [];

for (const [name, url] of Object.entries(packages)) {
  console.log(`Fetching ${name}...`);
  const packageResponse = await fetch(url);
  const body = await packageResponse.text();
  const packageJson = JSON.parse(body);
  if(packageJson.version === undefined){
    const hashSum = crypto.createHash("SHA256");
    hashSum.update(body);
    packageJson.version = hashSum.digest('hex').substring(0, 6);
  }
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

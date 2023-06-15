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
  const metaFunctionString = packageJson.items.find(item => item.name === '__meta' && item.type == 'function')
  const metaFunction = metaFunctionString !== undefined ? JSON.parse(metaFunctionString.code) : undefined
  const metaData = {
    version: metaFunction?.version ?? packageJson.version,
    website : metaFunction?.website ?? packageJson.website,
    dependencies: metaFunction?.dependencies?? packageJson.dependencies,
  }
  if(metaData.version === undefined){
    const hashSum = crypto.createHash("SHA256");
    hashSum.update(body);
    metaData.version = hashSum.digest('hex').substring(0, 6);
  }
  repository.push({
    name,
    packageName: packageJson.name,
    version: metaData.version,
    description: packageJson.description,
    url,
    dependencies: metaData.dependencies || [],
    website: metaData.website,
  });
}

fs.writeFileSync("public/repository.json", JSON.stringify(repository));

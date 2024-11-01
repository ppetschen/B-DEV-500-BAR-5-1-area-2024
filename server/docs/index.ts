import { Glob } from "bun";
import type { Route } from "./types";
import path from "node:path";
import { printNode, zodToTs } from "zod-to-ts";
import { parse } from "yaml";

const serviceGlob = new Glob("!*.*");
const sericeResult = serviceGlob.scan({
  cwd: new URL("..", import.meta.url).pathname,
  onlyFiles: false,
});

const fileGlob = new Glob("sources/routes/**/*.ts");

const getCommitHash = async () => {
  const cwdPath = path.join(
    new URL(import.meta.url).pathname,
    "..",
    "..",
    "..",
    ".git",
  );

  const gitGlob = new Glob("HEAD");
  const gitResult = gitGlob.scan({
    cwd: cwdPath,
    onlyFiles: true,
  });

  const gitFile = await Array.fromAsync(gitResult);
  if (!gitFile.length) {
    return `unknown-git`;
  }

  const head = Bun.file(
    path.join(
      new URL(import.meta.url).pathname,
      "..",
      "..",
      "..",
      ".git",
      gitFile[0],
    ),
  );
  const headContent = await head.text();

  if (!headContent.includes("ref:")) {
    return headContent.trim();
  }

  const ref = headContent.split(":")[1].trim();
  const refGlob = new Glob(`${ref}`);

  const refResult = refGlob.scan({
    cwd: cwdPath,
    onlyFiles: true,
  });

  const refFile = await Array.fromAsync(refResult);
  if (!refFile.length) {
    return `unknown`;
  }

  const refContent = Bun.file(
    path.join(
      new URL(import.meta.url).pathname,
      "..",
      "..",
      "..",
      ".git",
      refFile[0],
    ),
  );

  return (await refContent.text()).trim();
};

const yamlGlob = new Glob("kong.yaml");
const yamlResult = yamlGlob.scan({
  cwd: path.join(
    new URL("..", import.meta.url).pathname,
    "deployment",
    "config",
  ),
  absolute: true,
  onlyFiles: true,
});

const yamlFiles = await Array.fromAsync(yamlResult);
const yamlContent = await Promise.all(
  yamlFiles.map((file) => Bun.file(file).text()),
);

const yaml = yamlContent.map((content) => parse(content));

const getServiceInfo = (serviceName: string) => {
  const service = yaml[0].services.find(
    (service: { name: string }) => service.name === `${serviceName}-service`,
  );

  if (!service) {
    return { path: null, isProtected: false };
  }

  const path = service.routes?.[0]?.paths?.[0] ?? null;

  const isProtected = service.plugins?.some(
    (plugin: { name: string }) => plugin.name === "jwt",
  ) ?? false;

  return { path, isProtected };
};

let content = `<!-- deno-fmt-ignore-file -->
# Api routes documentation

> [!IMPORTANT]
> This documentation was automatically generated using \`Bun\` version \`${Bun.version}\` on
> GitHub actions, commit hash \`${await getCommitHash()}\`.
`;

for await (const service of sericeResult) {
  const fileResult = fileGlob.scan({
    cwd: path.join(new URL("..", import.meta.url).pathname, service),
    absolute: true,
    onlyFiles: true,
  });

  const files = (await Array.fromAsync(
    fileResult,
    (file) => import(file) as Promise<{ default: Route }>,
  )).map(({ default: route }) => route);

  if (!files.length) {
    continue;
  }

  content += `\n## ${service}\n\n`;

  const { isProtected, path: servicePath } = getServiceInfo(service);

  for (const file of files) {
    content += `\`\`\`http\n${file.method} ${
      servicePath ? `${servicePath}${file.path}` : file.path
    }\n\`\`\`\n`;
    content += `\`\`\`ts\n${
      isProtected
        ? "// Authorization: Bearer $AUTH_TOKEN\n"
        : "// This route is internal, won't be exposed\n"
    }${printNode(zodToTs(file.schema).node)}\n\`\`\`\n\n`;
  }
}

await Bun.write("api-routes.md", content);

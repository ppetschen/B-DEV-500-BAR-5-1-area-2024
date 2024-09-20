import fastify from "fastify";
import chalk from "chalk";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { getVersion, initTable } from "$/database";
import cors from "@fastify/cors";

export const app = fastify();
export type RouteInfo = Omit<Parameters<typeof app.route>[0], "method">;

app.register(cors, { origin: "*" });

const ROUTES_DIR = `${new URL(".", import.meta.url).pathname}routes`;
const WHITELISTED_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
] as const;

const getFilesRecursively = async (dir: string): Promise<string[]> => {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) =>
      dirent.isDirectory()
        ? getFilesRecursively(resolve(dir, dirent.name))
        : resolve(dir, dirent.name)
    ),
  );
  return files.flat();
};

const registerRoutes = async () => {
  const files = await getFilesRecursively(ROUTES_DIR);
  const routes = files.map(async (file) => {
    if (!file.endsWith(".ts")) return;

    const route = await import(file) as {
      [method in typeof WHITELISTED_METHODS[number]]?: RouteInfo;
    };

    WHITELISTED_METHODS.forEach((method) => {
      if (!route[method]) {
        return;
      }

      console.log(
        chalk.green(
          `> Registering route ${chalk.magenta(method)} ${
            chalk.blue(route[method].url)
          }`,
        ),
      );

      app.route({ method, ...route[method] });
    });
  });

  await Promise.all(routes);
};

if (import.meta.main) {
  console.log(chalk.cyan(`> ${await getVersion()}`));

  await initTable();
  await registerRoutes();

  console.log(chalk.yellow("> Starting server on port 3000"));
  await app.listen({ port: 3000 });
}

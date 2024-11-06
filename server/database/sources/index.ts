import { Glob, type Server } from "bun";
import type { Route } from "./types";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { client } from "./utils";
import process from "node:process";

const glob = new Glob("routes/**/{*,v2}/*.ts");
const result = glob.scan({
  cwd: new URL(".", import.meta.url).pathname,
  absolute: true,
  onlyFiles: true,
});

const routes = (await Array.fromAsync(
  result,
  (file) => import(file) as Promise<{ default: Route }>,
)).map(({ default: route }) => route);

const infoRoute: Route = {
  path: "/info",
  method: "GET",
  handler: async () => {
    const { rows: [{ version }] } = await client.query<{ version: number }>(
      "SELECT version()",
    );
    return new Response(
      JSON.stringify({ version, routes: routes.map((route) => route.path) }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
  schema: z.any(),
};

routes.push(infoRoute);

const serve = async (request: Request, server: Server): Promise<Response> => {
  const route = routes.find((route) =>
    route.path === new URL(request.url).pathname &&
    route.method === request.method
  );

  if (!route) {
    return new Response(`Route not found => ${new URL(request.url).pathname}`, {
      status: 404,
    });
  }

  const clone = request.clone();

  if (["POST", "PUT", "PATCH"].includes(clone.method)) {
    const body = await clone.text();
    try {
      const json = JSON.parse(body);
      await route.schema.parseAsync(json);
    } catch (error) {
      const validationError = fromError(error);
      return new Response(JSON.stringify(validationError.toString()), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  return route.handler(request, server);
};

if (import.meta.main) {
  const port = process.env["PORT"] || 8080;
  console.log(`Listening on :${port}`);
  Bun.serve({ fetch: serve, port });
}

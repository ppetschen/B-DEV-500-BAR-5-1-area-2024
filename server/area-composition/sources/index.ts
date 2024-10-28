import type { Server } from "bun";
import type { Route } from "./types.ts";
import { Glob } from "bun";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import process from "node:process";

if (process.env["KONG_DELAY_MS"]) {
  await new Promise((resolve) =>
    setTimeout(resolve, Number(process.env["KONG_DELAY_MS"]))
  );
}

const glob = new Glob("routes/*.ts");
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
    return new Response(
      JSON.stringify({ routes: routes.map((route) => route.path) }),
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

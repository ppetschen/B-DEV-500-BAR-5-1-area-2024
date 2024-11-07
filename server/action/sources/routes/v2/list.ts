import type { Route } from "../../types";
import { z } from "zod";
import { createWebHookMap } from "../../utils";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/list",
  method: "GET",
  schema,
  handler: async (_request, _server) => {
    return new Response(JSON.stringify(Object.keys(createWebHookMap)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

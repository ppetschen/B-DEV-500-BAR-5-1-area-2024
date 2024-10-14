import type { Route } from "../types";
import { z } from "zod";
import { host } from "../utils";

const schema = z.object({
  action_id: z.string(),
  service_name: z.string().max(255),
  execution_endpoint: z.string().max(255),
  status: z.enum(["pending", "failure", "success"]),
});

const route: Route<typeof schema> = {
  path: "/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const {
      action_id,
      service_name,
      execution_endpoint,
      status,
    } = await request.json();

    const insertRequest = await fetch(
      host("DATABASE", "/reaction/create"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_id,
          service_name,
          execution_endpoint,
          status,
        }),
      },
    );

    if (!insertRequest.ok) {
      return new Response(await insertRequest.text(), { status: 500 });
    }

    const { id } = await insertRequest.json();

    return new Response(
      JSON.stringify({
        id,
      }),
      { status: 200 },
    );
  },
};

export default route;

import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  service_name: z.string().max(255),
  event_type: z.string().max(255),
  payload: z.record(z.unknown()),
});

const route: Route<typeof schema> = {
  path: "/action/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { service_name, event_type, payload } = await request.json();
    const { rows: [result] } = await client.query(
      `INSERT INTO actions (service_name, event_type, payload) 
                  VALUES ($1, $2, $3)
                  RETURNING *`,
      [service_name, event_type, payload],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

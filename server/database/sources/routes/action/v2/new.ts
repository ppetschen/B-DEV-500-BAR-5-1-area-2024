import { z } from "zod";
import type { Route } from "../../../types";
import { client } from "../../../utils";

const schema = z.object({
  service_name: z.string().max(255),
  event_type: z.string().max(255),
  payload: z.record(z.unknown()),
  owner_id: z.number(),
});

const route: Route<typeof schema> = {
  path: "/action/new",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const {
      service_name,
      event_type,
      payload,
      owner_id,
    } = await request.json();

    const { rows: [result] } = await client.query(
      `INSERT INTO actions (
          service_name,
          event_type,
          payload,
          owner_id
        ) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [service_name, event_type, payload, owner_id],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

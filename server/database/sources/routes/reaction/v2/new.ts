import { z } from "zod";
import type { Route } from "../../../types";
import { client } from "../../../utils";

const schema = z.object({
  service_name: z.string().max(255),
  execution_endpoint: z.string().max(255),
  markup: z.string(),
  status: z.enum(["pending", "failure", "success"]),
  owner_id: z.number(),
});

const route: Route<typeof schema> = {
  path: "/reaction/new",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const {
      markup,
      service_name,
      execution_endpoint,
      status,
      owner_id,
    } = await request.json();

    const { rows: [result] } = await client.query(
      `INSERT INTO reactions (
          owner_id,
          markup,
          service_name,
          execution_endpoint,
          status
        ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
      [owner_id, markup, service_name, execution_endpoint, status],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

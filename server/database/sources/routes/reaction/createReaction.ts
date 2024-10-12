import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  action_id: z.string(),
  service_name: z.string(),
  execution_endpoint: z.string(),
  status: z.enum(["pending", "failure", "success"]),
});

const route: Route<typeof schema> = {
  path: "/reaction/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const {
      action_id,
      service_name,
      execution_endpoint,
      status,
    } = await request.json();
    const { rows: [result] } = await client.query(
      `INSERT INTO reactions (action_id, service_name, execution_endpoint, status) 
                  VALUES ($1, $2, $3, $4)
                  RETURNING *`,
      [action_id, service_name, execution_endpoint, status],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

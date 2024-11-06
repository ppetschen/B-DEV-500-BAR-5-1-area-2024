import { z } from "zod";
import type { Route } from "../../../types";
import { client } from "../../../utils";

const schema = z.object({
  service_name: z.string().max(255),
  execution_endpoint: z.string().max(255),
  markup: z.string(),
  status: z.enum(["pending", "failure", "success"]),
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
    } = await request.json();

    const { rows: [result] } = await client.query(
      `INSERT INTO reactions (
          markup,
          service_name,
          execution_endpoint,
          status
        ) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [markup, service_name, execution_endpoint, status],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

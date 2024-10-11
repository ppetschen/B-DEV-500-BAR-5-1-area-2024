import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  user_id: z.number(),
  service: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

const route: Route<typeof schema> = {
  path: "/service-management/create-service-subscription",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { user_id, service, access_token, refresh_token, expires_in } =
      await request.json();
    const { rows: [result] } = await client.query(
      `INSERT INTO service_subscriptions (user_id, service, access_token, refresh_token, expires_in) 
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
      [user_id, service, access_token, refresh_token, expires_in],
    );
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

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
  path: "/service-management/update-service-subscription",
  method: "PUT",
  schema,
  handler: async (request, _server) => {
    const { user_id, service, access_token, refresh_token, expires_in } =
      await request.json();

    const { rows: [result] } = await client.query(
      `UPDATE service_subscriptions
                 SET access_token = $3, refresh_token = $4, expires_in = $5, updated_at = NOW()
                 WHERE user_id = $1 AND service = $2
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

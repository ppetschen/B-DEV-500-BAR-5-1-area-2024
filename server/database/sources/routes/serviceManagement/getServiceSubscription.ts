import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  user_id: z.number(),
  service: z.string(),
});

const route: Route<typeof schema> = {
  path: "/service-management/get-service-subscription",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { user_id, service } = await request.json();
    const { rows: [result] } = await client.query(
      "SELECT * FROM service_subscriptions WHERE user_id = $1 AND service = $2",
      [user_id, service],
    );

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Service subscription not found" }),
        { status: 404 },
      );
    } else {
      return new Response(JSON.stringify(result));
    }
  },
};

export default route;

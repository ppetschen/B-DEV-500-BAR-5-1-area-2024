import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  user_id: z.number(),
});

const route: Route<typeof schema> = {
  path: "/service-management/get-services-by-user",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { user_id } = await request.json();
    const { rows } = await client.query(
      "SELECT * FROM service_subscriptions WHERE user_id = $1",
      [user_id],
    );

    if (!rows.length) {
      return new Response(
        JSON.stringify({ error: "Services not found" }),
        { status: 404 },
      );
    } else {
      const services = rows.map((row) => row.service);
      return new Response(JSON.stringify({ services }));
    }
  },
};

export default route;

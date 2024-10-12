import type { Route } from "../../types";
import { z } from "zod";
import { getServiceSubscription } from "../../controllers/serviceController";

const schema = z.object(
  {
    service: z.string(),
    user_id: z.number(),
  },
);

const route: Route<typeof schema> = {
  path: "/auth/get-service-token",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { service, user_id } = await request.json();

    const response = await getServiceSubscription(service, user_id);
    if (!response) {
      return new Response(
        JSON.stringify({ error: "Service subscription not found" }),
        { status: 404 },
      );
    } else {
      return new Response(
        JSON.stringify({ data: { access_token: response.access_token } }),
      );
    }
  },
};

export default route;

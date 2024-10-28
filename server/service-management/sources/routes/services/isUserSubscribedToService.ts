import type { Route } from "../../types";
import { z } from "zod";
import { getServiceSubscription } from "../../controllers/serviceController";
import { getUserByToken } from "../../controllers/userController";

const schema = z.object(
  {
    service: z.string(),
  },
);

const route: Route<typeof schema> = {
  path: "/auth/is_user_subscribed",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    const user = await getUserByToken(token!);
    const user_id = user.id;
    const { service } = await request.json();

    const response = await getServiceSubscription(service, user_id);
    if (!response) {
      return new Response(JSON.stringify("User not subscribed to ${service}"), {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify("User is subscribed to ${service}"), {
        status: 200,
      });
    }
  },
};

export default route;
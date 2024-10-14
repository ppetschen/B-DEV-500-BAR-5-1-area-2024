import type { Route } from "../../types";
import { z } from "zod";
import { getServiceSubscription } from "../../controllers/serviceController";
import { getConsumerFromJWT } from "../../controllers/jwtController";
import { getUserById } from "../../controllers/userController";

const schema = z.object(
  {
    service: z.string(),
  },
);

const route: Route<typeof schema> = {
  path: "/auth/get-service-token",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    let user = await getConsumerFromJWT(token!);
    user = await getUserById(user);
    user = await user.json();
    const user_id = user.id;
    const { service } = await request.json();

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

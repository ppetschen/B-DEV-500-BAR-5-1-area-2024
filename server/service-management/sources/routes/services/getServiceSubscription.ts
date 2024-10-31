import type { Route } from "../../types";
import { z } from "zod";
import {
  getServiceSubscription,
  isAccessTokenValid,
} from "../../controllers/serviceController";
import { oauthRefreshAccessToken } from "../../controllers/oAuth4WebApiRefreshTokenController";

const schema = z.object(
  {
    service: z.string(),
    user_id: z.number(),
  },
);

const route: Route<typeof schema> = {
  path: "/auth/get-service-subscription",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { user_id, service } = await request.json();
    const response = await getServiceSubscription(service, user_id);
    if (!response) {
      return new Response(
        JSON.stringify({
          error:
            "Service subscription not found, user needs to subscribe to ${service}.",
        }),
        { status: 404 },
      );
    } else {
      let serviceSubscription = response;
      const isTokenValid = isAccessTokenValid(serviceSubscription);
      if (!isTokenValid) {
        serviceSubscription = await oauthRefreshAccessToken(
          serviceSubscription,
        );
      }
      return new Response(
        JSON.stringify({
          data: {
            ...serviceSubscription,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
};

export default route;

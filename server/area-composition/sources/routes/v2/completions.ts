import type { Route } from "../../types";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { complete, host } from "../../utils";

const schema = z.object({
  from: z.enum(["github"]),
  to: z.enum(["discord", "notion", "google-mail"]),
});

const route: Route<typeof schema> = {
  path: "/completions",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    console.log("Received completion request");
    const authToken = request.headers.get("Authorization") ?? "";
    const [, token] = authToken.split("Bearer ");

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const decoded = jwt.decode(token);

    if (!(decoded instanceof Object)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { consumer } = decoded;
    const { from, to } = await request.json();

    const toServiceSubscriptionRequest = await fetch(
      host("DATABASE", "/service-management/get-service-subscription"),
      {
        method: "POST",
        headers: { ...request.headers },
        body: JSON.stringify({
          service: to,
          user_id: consumer,
        }),
      }
    );

    console.log(`Entra1 --------------------`, toServiceSubscriptionRequest);
    if (!toServiceSubscriptionRequest.ok) {
      return new Response("The user has not subscribed to the destination", {
        status: 403,
      });
    }

    const fromServiceSubscriptionRequest = await fetch(
      host("DATABASE", "/service-management/get-service-subscription"),
      {
        method: "POST",
        headers: { ...request.headers },
        body: JSON.stringify({
          service: from,
          user_id: consumer,
        }),
      }
    );

    console.log(`Entra2 --------------------`);
    if (!fromServiceSubscriptionRequest.ok) {
      return new Response("The user has not subscribed to the source", {
        status: 403,
      });
    }

    const {
      access_token: toAccessToken,
      expires_in: toExpiresIn,
      updated_at: toUpdatedAt,
    } = await toServiceSubscriptionRequest.json();

    const {
      access_token: fromAccessToken,
      expires_in: fromExpiresIn,
      updated_at: fromUpdatedAt,
    } = await fromServiceSubscriptionRequest.json();

    if (Date.now() > toUpdatedAt + toExpiresIn) {
      return new Response(`The credentials for ${to} are expired`, {
        status: 403,
      });
    }

    if (Date.now() > fromUpdatedAt + fromExpiresIn) {
      return new Response(`The credentials for ${from} are expired`, {
        status: 403,
      });
    }

    const fromCompletion = await complete(from, fromAccessToken);
    const toCompletion = await complete(to, toAccessToken);

    return new Response(
      JSON.stringify({
        from: fromCompletion,
        to: toCompletion,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};

export default route;

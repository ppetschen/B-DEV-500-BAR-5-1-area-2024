import type { Route } from "../../types";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { create, host } from "../../utils";

const schema = z.object({
  type: z.enum([
    "discord",
    "google-mail",
    "google-drive",
    "notion",
    "google-calendar",
  ]),
  context: z.unknown(),
  markup: z.string(),
});

const route: Route<typeof schema> = {
  path: "/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const authToken = request.headers.get("Authorization") ?? "";
    const [, token] = authToken.split("Bearer ");

    if (!token) {
      return new Response("Unauthorized, no token", { status: 401 });
    }

    const decoded = jwt.decode(token);

    if (!(decoded instanceof Object)) {
      return new Response(`Expected object, got ${JSON.stringify(decoded)}`, {
        status: 401,
      });
    }

    const { consumer } = decoded;
    const { type, context, markup } = await request.json();

    const serviceSubscriptionRequest = await fetch(
      host("DATABASE", "/service-management/get-service-subscription"),
      {
        method: "POST",
        headers: { ...request.headers },
        body: JSON.stringify({
          service: type,
          user_id: consumer,
        }),
      },
    );

    if (!serviceSubscriptionRequest.ok) {
      return new Response("The user has not subscribed to the source", {
        status: 403,
      });
    }

    const { access_token, refresh_token, expires_in, updated_at, webhook_url } =
      await serviceSubscriptionRequest.json();

    if (Date.now() > updated_at + expires_in) {
      return new Response("The credentials are expired", {
        status: 403,
      });
    }

    try {
      const { url } = await create(type, {
        ...(typeof context === "object" ? context : {}),
        _internal: {
          access_token,
          refresh_token,
          webhook_url,
        },
      });

      const insertRequest = await fetch(host("DATABASE", "/reaction/new"), {
        method: "POST",
        headers: { ...request.headers },
        body: JSON.stringify({
          service_name: type,
          execution_endpoint: url,
          markup,
          status: "pending",
          owner_id: consumer,
        }),
      });

      if (!insertRequest.ok) {
        return new Response("Failed to create webhook", { status: 500 });
      }

      const { id } = await insertRequest.json();

      return new Response(JSON.stringify({ id }), {
        status: 201,
      });
    } catch (e) {
      return new Response("Failed to create webhook", { status: 500 });
    }
  },
};

export default route;

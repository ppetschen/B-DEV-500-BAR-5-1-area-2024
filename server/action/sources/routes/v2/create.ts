import type { Route } from "../../types";
import { z } from "zod";
import { create, host } from "../../utils";
import jwt from "jsonwebtoken";

const schema = z.object({
  type: z.enum(["GITHUB"]),
  context: z.unknown(),
  reaction_id: z.string(),
});

const route: Route<typeof schema> = {
  path: "/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
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
    const { type, context, reaction_id } = await request.json();

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

    const {
      access_token,
      refresh_token,
      expires_in,
      updated_at,
    } = await serviceSubscriptionRequest.json();

    if (Date.now() > updated_at + expires_in) {
      return new Response("The credentials are expired", {
        status: 403,
      });
    }

    try {
      await create(type, {
        ...(typeof context === "object" ? context : {}),
        "_internal": {
          access_token,
          refresh_token,
          reaction_id,
        },
      });
    } catch (e) {
      return new Response("Failed to create webhook", { status: 500 });
    }

    const insertRequest = await fetch(
      host("DATABASE", "/action/new"),
      {
        method: "POST",
        headers: { ...request.headers },
        body: JSON.stringify({
          service_name: type,
          event_type: "webhook",
          payload: context,
          owner_id: consumer,
        }),
      },
    );

    if (!insertRequest.ok) {
      return new Response("Failed to save to database", { status: 500 });
    }

    const { id } = await insertRequest.json();

    return new Response(JSON.stringify({ id }), { status: 201 });
  },
};

export default route;

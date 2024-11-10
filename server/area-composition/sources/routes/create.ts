import type { Route } from "../types";
import { z } from "zod";
import { host } from "../utils";
import jwt from "jsonwebtoken";

const schema = z.object({
  from_service_name: z.string().max(255),
  from_event_type: z.string().max(255),
  from_payload: z.record(z.unknown()),
  to_service_name: z.string().max(255),
  to_execution_endpoint: z.string().max(255),
});

const route: Route<typeof schema> = {
  path: "/create",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const {
      from_service_name,
      from_event_type,
      from_payload,
      to_service_name,
      to_execution_endpoint,
    } = await request.json();

    const authHeader = request.headers.get("Authorization") ?? "";
    const [_, token] = authHeader.split("Bearer ");

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const decoded = jwt.decode(token);

    if (!(decoded instanceof Object)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { consumer } = decoded;

    const actionRequest = await fetch(
      host("ACTION", "/create"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_name: from_service_name,
          event_type: from_event_type,
          payload: from_payload,
          owner_id: consumer,
        }),
      },
    );

    if (!actionRequest.ok) {
      return new Response(await actionRequest.text(), { status: 500 });
    }

    const { id: actionId } = await actionRequest.json();

    const reactionRequest = await fetch(
      host("REACTION", "/create"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_id: actionId,
          service_name: to_service_name,
          execution_endpoint: to_execution_endpoint,
          status: "pending",
        }),
      },
    );

    if (!reactionRequest.ok) {
      return new Response(await reactionRequest.text(), { status: 500 });
    }


    return new Response(
      JSON.stringify({
        actionId,
        reactionId,
      }),
      { status: 200 },
    );
  },
};

export default route;

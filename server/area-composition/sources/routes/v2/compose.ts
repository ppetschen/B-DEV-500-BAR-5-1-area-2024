import type { Route } from "../../types";
import { host } from "../../utils";
import { z } from "zod";

const schema = z.object({
  from: z.object({
    type: z.enum(["github"]),
    context: z.unknown(),
  }),
  to: z.object({
    type: z.enum(["discord", "google-mail"]),
    context: z.unknown(),
  }),
  markup: z.string(),
});

const route: Route<typeof schema> = {
  path: "/compose",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { from, to, markup } = await request.json();

    const reactionRequest = await fetch(host("REACTION", "/create"), {
      headers: request.headers,
      method: "POST",
      body: JSON.stringify({
        type: to.type,
        context: to.context,
        markup,
      }),
    });
    if (!reactionRequest.ok) {
      return new Response("Failed to create reaction", { status: 500 });
    }

    const { id: reactionId } = await reactionRequest.json();
    const actionRequest = await fetch(host("ACTION", "/create"), {
      headers: request.headers,
      method: "POST",
      body: JSON.stringify({
        type: from.type,
        context: from.context,
        reaction_id: reactionId,
      }),
    });
    
    if (!actionRequest.ok) {
      return new Response("Failed to create action", { status: 500 });
    }

    const { id: actionId } = await actionRequest.json();

    return new Response(
      JSON.stringify({
        action_id: actionId,
        reaction_id: reactionId,
      }),
      {
        status: 201,
      },
    );
  },
};

export default route;

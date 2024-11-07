import type { Route } from "../../types";
import { z } from "zod";
import { host } from "../../utils";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/available",
  method: "GET",
  schema,
  handler: async (_request, _server) => {
    const allActions = await fetch(host("ACTION", "/list"));
    if (!allActions.ok) {
      return new Response("Failed to fetch actions", {
        status: 500,
      });
    }

    const allReactions = await fetch(host("REACTION", "/list"));
    if (!allReactions.ok) {
      return new Response("Failed to fetch reactions", {
        status: 500,
      });
    }

    const actions = await allActions.json();
    const reactions = await allReactions.json();

    return new Response(
      JSON.stringify({
        actions,
        reactions,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default route;

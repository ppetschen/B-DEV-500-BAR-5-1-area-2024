import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  state: z.string(),
});

const route: Route<typeof schema> = {
  path: "/service-management/delete-oauth-session",
  method: "DELETE",
  schema,
  handler: async (request, _server) => {
    const { state } = await request.json();

    const { rows: [result] } = await client.query(
      "DELETE FROM oauth_sessions WHERE state = $1 RETURNING *",
      [state],
    );

    if (!result) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

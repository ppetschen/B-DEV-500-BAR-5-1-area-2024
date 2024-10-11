import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  id: z.number(),
});

const route: Route<typeof schema> = {
  path: "/service-management/get-oauth-session",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { id } = await request.json();

    const { rows: [result] } = await client.query(
      "SELECT * FROM oauth_sessions WHERE id = $1",
      [id],
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

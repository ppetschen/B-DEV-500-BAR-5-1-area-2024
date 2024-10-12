import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  consumer: z.number(),
});

const route: Route<typeof schema> = {
  path: "/user-management/get-user-by-id",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { consumer } = await request.json();
    const { rows: [user] } = await client.query(
      "SELECT * FROM users WHERE id = $1",
      [consumer],
    );
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  email: z.string().email(),
});

const route: Route<typeof schema> = {
  path: "/user-management/get-user-by-email",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { email } = await request.json();

    const { rows: [user] } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
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

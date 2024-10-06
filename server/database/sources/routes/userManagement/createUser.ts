import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  email: z.string().email(),
  hashedPassword: z.string(),
});

const route: Route<typeof schema> = {
  path: "/user-management/create-user",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { email, hashedPassword } = await request.json();

    const { rows: [result] } = await client.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

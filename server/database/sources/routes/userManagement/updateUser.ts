import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  description: z.string(),
});

const route: Route<typeof schema> = {
  path: "/user-management/update-user",
  method: "PUT",
  schema,
  handler: async (request, _server) => {
    const { id, email, password_hash, first_name, last_name, description } =
      await request.json();

    const { rows: [result] } = await client.query(
      `UPDATE users 
            set email = $2, password_hash = $3, first_name = $4, last_name = $5, description = $6, updated_at = NOW()
            WHERE id = $1
            RETURNING *`,
      [id, email, password_hash, first_name, last_name, description],
    );
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

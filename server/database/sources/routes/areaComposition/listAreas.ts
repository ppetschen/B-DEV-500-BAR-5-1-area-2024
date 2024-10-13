import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  userId: z.number(),
});

const route: Route<typeof schema> = {
  path: "/area-composition/list-areas",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { userId } = await request.json();

    const { rows } = await client.query(
      `SELECT * FROM actions WHERE owner_id = $1`,
      [userId],
    );

    return new Response(JSON.stringify(rows), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

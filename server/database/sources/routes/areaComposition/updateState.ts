import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../..";

const schema = z.object({
  id: z.string(),
  status: z.enum(["success", "failure", "pending"]),
});

const route: Route<typeof schema> = {
  path: "/area-composition/update-state",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { id, status } = await request.json();
    const { rows: [result] } = await client.query(
      `UPDATE area_compositions SET status = $2 WHERE id = $1 RETURNING *`,
      [id, status],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

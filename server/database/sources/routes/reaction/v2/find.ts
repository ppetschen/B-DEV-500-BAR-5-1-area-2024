import { z } from "zod";
import type { Route } from "../../../types";
import { client } from "../../../utils";

const schema = z.object({
  id: z.string(),
});

const route: Route<typeof schema> = {
  path: "/reaction/find",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { id } = await request.json();

    const { rows: [result] } = await client.query(
      `SELECT * FROM reactions WHERE id = $1`,
      [id],
    );

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

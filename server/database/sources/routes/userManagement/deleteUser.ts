import { z } from "zod";
import { customError, type Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  id: z.number(),
});

const route: Route<typeof schema> = {
  path: "/user-management/delete-user",
  method: "DELETE",
  schema,
  handler: async (request, _server) => {
    try {
      const { id } = await request.json();

      const { rows: [result] } = await client.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id],
      );
      if (!result.id) {
        throw new customError("User not found", 404);
      }

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      if (error instanceof customError) {
        return new Response(JSON.stringify(error.message), {
          status: error.status,
        });
      }
      console.error(error);
      return new Response(JSON.stringify("Internal server error"), {
        status: 500,
      });
    }
  },
};

export default route;

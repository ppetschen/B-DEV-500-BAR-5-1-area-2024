import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  email: z.string(),
  history_id: z.string(),
});

const route: Route<typeof schema> = {
  path: "/service-management/update-google-mail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const { email, history_id } = await request.json();

      const { rows: [result] } = await client.query(
        `UPDATE google_mail_history
                 SET history_id = $2
                 WHERE email = $1
                 RETURNING *`,
        [email, history_id],
      );

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error processing request:", error);

      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
};

export default route;

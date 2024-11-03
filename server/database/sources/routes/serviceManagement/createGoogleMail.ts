import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  email: z.string(),
  history_id: z.string(),
});

const route: Route<typeof schema> = {
  path: "/service-management/create-google-mail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const { email, history_id } = await request
        .json();

      const { rows: [result] } = await client.query(
        `INSERT INTO google_mail_history (email, history_id) 
                 VALUES ($1, $2)
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

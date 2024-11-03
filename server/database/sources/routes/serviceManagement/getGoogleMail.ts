import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  email: z.string(),
});

const route: Route<typeof schema> = {
  path: "/service-management/get-google-mail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const { email } = await request.json();

      const { rows: [result] } = await client.query(
        `SELECT * FROM google_mail_history WHERE email = $1`,
        [email],
      );

      if (!result) {
        return new Response(
          JSON.stringify({ error: "Record not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

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

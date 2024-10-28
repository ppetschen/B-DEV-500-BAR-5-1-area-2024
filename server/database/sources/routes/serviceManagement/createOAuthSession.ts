import { z } from "zod";
import type { Route } from "../../types";
import { client } from "../../utils";

const schema = z.object({
  code_verifier: z.string(),
  state: z.string(),
  user_email: z.string(),
});

const route: Route<typeof schema> = {
  path: "/service-management/create-oauth-session",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const { code_verifier, state, user_email } = await request.json();

      const { rows: [result] } = await client.query(
        `INSERT INTO oauth_sessions (code_verifier, state, user_email) 
                 VALUES ($1, $2, $3)
                 RETURNING *`,
        [code_verifier, state, user_email],
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
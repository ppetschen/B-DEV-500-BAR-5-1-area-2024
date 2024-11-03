import type { Route } from "../types";
import { z } from "zod";

const schema = z.object({
  access_token: z.string(),
});

const route: Route<typeof schema> = {
  path: "/disable/google-mail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const { access_token } = await request.json();
      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/stop",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to disable Gmail watch: ${errorText}`);
      }
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error disabling Gmail watch:", error);
      return new Response("Error", { status: 500 });
    }
  },
};

export default route;

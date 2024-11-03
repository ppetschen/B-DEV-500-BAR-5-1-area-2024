import type { Route } from "../types";
import { z } from "zod";

const schema = z.object({
  access_token: z.string(),
});

const route: Route<typeof schema> = {
  path: "/enable/google-mail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    try {
      const { access_token } = await request.json();

      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/watch",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicName: "projects/area-proj-437522/topics/gmail",
            labelIds: ["INBOX"],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to enable Gmail watch: ${errorText}`);
      }
      return new Response("Watch enabled", { status: 200 });
    } catch (error) {
      console.error("Error enabling Gmail watch:", error);
      return new Response("Error", { status: 500 });
    }
  },
};

export default route;

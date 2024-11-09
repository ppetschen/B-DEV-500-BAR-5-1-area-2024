import type { Route } from "../types";
import { z } from "zod";

const schema = z.object({
  to: z.string(),
  subject: z.string(),
  content: z.string(),
  access_token: z.string(),
});

const route: Route<typeof schema> = {
  path: "/send-google-mail",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { to, subject, content, access_token } = await request.json();
    console.log(
      "Sending email to",
      to,
      "with subject",
      subject,
      "and content",
      content,
      "access_token",
      access_token,
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  },
};

export default route;

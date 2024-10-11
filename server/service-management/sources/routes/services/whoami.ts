import type { Route } from "../../types";
import { z } from "zod";
import { host } from "../../utils";
import jwt from "jsonwebtoken";

const schema = z.never();

const route: Route<typeof schema> = {
  path: "/whoami",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!token) {
      return new Response("Unauthorized, no token provided", { status: 401 });
    }

    const jwtSchema = z.object({
      consumer: z.string(),
      realm: z.union([z.literal("USER"), z.literal("REALM")]),
    });

    const result = jwtSchema.safeParse(jwt.decode(token));

    const decodedToken = jwt.decode(token);

    if (!result.success) {
      return new Response("Unauthorized, no jwt", { status: 401 });
    }
    const response = await fetch(
      host("DATABASE", "/user-management/get-user-by-id"),
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          consumer: result.data.consumer,
        }),
      },
    );

    if (!response.ok) {
      return new Response("Unauthorized, no user found", { status: 401 });
    }

    return new Response(await response.text(), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

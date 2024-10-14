import type { Route } from "../types";
import { z } from "zod";
import { host } from "../utils";
import jwt from "jsonwebtoken";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/list",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const decoded = jwt.decode(token);

    if (!(decoded instanceof Object)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { consumer } = decoded;

    const response = await fetch(
      host("DATABASE", "/area-composition/list-areas"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: consumer }),
      },
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default route;

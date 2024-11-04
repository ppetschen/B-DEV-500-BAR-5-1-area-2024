import type { Route } from "../types";
import { z } from "zod";
import { compare } from "bcryptjs";
import { craftJWTFromResponse, createJWT, host } from "../utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string().optional().default(""),
});

const route: Route<typeof schema> = {
  path: "/login",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { email, password } = schema.parse(await request.json());
    const method = new URLSearchParams(request.url.split("?")[1]).get(
      "method",
    );
    if (method != "third-party" && method != "credentials") {
      console.log(method);
      return new Response("Invalid method", { status: 400 });
    }

    const userRequest = await fetch(
      host("DATABASE", "/user-management/get-user-by-email"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    if (!userRequest.ok) {
      return new Response(await userRequest.text(), { status: 500 });
    }

    const user = await userRequest.json();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (method === "credentials") {
      if (password === "") {
        return new Response("Password is required", { status: 400 });
      }

      const passwordMatch = await compare(password, user.password_hash);

      if (!passwordMatch) {
        return new Response("Unauthorized", { status: 401 });
      }
    }
    if (method === "third-party") {
      /**
       * Question:
       * Do we need to implement a way to authenticate third-party users? Like control their token or smth?
       */
    }

    const jwt = await createJWT();

    return new Response(
      JSON.stringify({
        ...user,
        token: craftJWTFromResponse("USER", jwt, user.id),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};

export default route;

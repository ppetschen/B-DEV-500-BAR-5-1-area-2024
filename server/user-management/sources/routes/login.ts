import type { Route } from "../types";
import { z } from "zod";
import { compare } from "bcryptjs";
import { craftJWTFromResponse, createJWT, host } from "../utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const route: Route<typeof schema> = {
  path: "/login",
  method: "POST",
  schema,
  handler: async (request, _server) => {
    const { email, password } = await request.json();

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

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return new Response("Unauthorized", { status: 401 });
    }

    const jwt = await createJWT();

    return new Response(
      JSON.stringify({
        ...user,
        token: craftJWTFromResponse("USER", jwt),
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

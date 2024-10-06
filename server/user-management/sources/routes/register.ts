import type { Route } from "../types";
import { z } from "zod";
import { hash } from "bcryptjs";
import { craftJWTFromResponse, createJWT, host } from "../utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const route: Route<typeof schema> = {
  path: "/register",
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

    if (userRequest.ok) {
      return new Response("Conflict", { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const resultRequest = await fetch(
      host("DATABASE", "/user-management/create-user"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, hashedPassword }),
      },
    );

    if (!resultRequest.ok) {
      return new Response(await resultRequest.text(), { status: 500 });
    }

    const result = await resultRequest.json();
    const jwt = await createJWT();

    return new Response(
      JSON.stringify({
        ...result,
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

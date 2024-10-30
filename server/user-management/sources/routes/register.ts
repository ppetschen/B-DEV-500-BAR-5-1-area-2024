import type { Route } from "../types";
import { z } from "zod";
import { hash } from "bcryptjs";
import { craftJWTFromResponse, createJWT, host } from "../utils";
import { v4 as uuidv4 } from 'uuid';

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

    if (userRequest.ok) {
      return new Response("Conflict, user already exists", { status: 409 });
    }
    let hashedPassword;
    if (method === "third-party") {
      const randomPassword = uuidv4();
      hashedPassword = await hash(randomPassword, 10);
    }
    if (method === "credentials") {
      hashedPassword = await hash(password, 10);
    }

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
        token: craftJWTFromResponse("USER", jwt, result.id),
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

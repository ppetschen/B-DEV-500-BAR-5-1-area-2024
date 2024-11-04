import { z } from "zod";
import type { Route } from "../types";
import { getSession } from "../controllers/sessionController";
import { authorizeServiceCallback } from "../controllers/oAuth4WebApiCallbackController";
import { craftJWTFromResponse, createJWT, host } from "../utils";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const schema = z.any();
// Define the route for handling the OAuth callback
// one eternity later, the user lands back on the redirect_uri
// Authorization Code Grant Request & Response
const route: Route<typeof schema> = {
  path: "/auth/callback",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    console.log("Request to /auth/callback", request.url);
    try {
      let service = new URLSearchParams(request.url.split("?")[1]).get(
        "service",
      );
      if (!service) {
        const state = new URLSearchParams(request.url.split("?")[1]).get(
          "state",
        );
        const session = await getSession(state!);
        service = session.service;
      }
      if (!service) {
        throw new Error(`Service: ${service} not found`);
      }

      const email = await authorizeServiceCallback(service, request.url);
      if (email == "") {
        return new Response(JSON.stringify({ error: "Failed to authorize" }), {
          status: 500,
        });
      }
      console.log("User email", email);
      let userRequest;
      userRequest = await fetch(
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
        const randomPassword = uuidv4();
        const hashedPassword = await hash(randomPassword, 10);

        userRequest = await fetch(
          host("DATABASE", "/user-management/create-user"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, hashedPassword }),
          },
        );
      }
      if (!userRequest.ok) {
        return new Response(await userRequest.text(), { status: 500 });
      }

      const user = await userRequest.json();

      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }
      const jwt = await createJWT();
      const token = craftJWTFromResponse("USER", jwt, user.id);
      const frontend_redirect_url =
        `http://localhost:5173/login?token=${token}`;
      return Response.redirect(frontend_redirect_url);
    } catch (error) {
      console.log("Error in service callback", error);
      return new Response(
        JSON.stringify({ error: "Failed to authorize", information: error }),
        {
          status: 500,
        },
      );
    }
  },
};

export default route;
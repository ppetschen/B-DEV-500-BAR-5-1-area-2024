import { z } from "zod";
import type { Route } from "../types";
import { authorizeServiceCallback } from "../controllers/oAuth4WebApiCallbackController";
import process from "node:process";

const schema = z.any();

// Define the route for handling the OAuth callback
// one eternity later, the user lands back on the redirect_uri
// Authorization Code Grant Request & Response
const route: Route<typeof schema> = {
  path: "/auth/callback",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    try {
      const service = new URLSearchParams(request.url.split("?")[1]).get(
        "service",
      );
      if (!service) {
        throw Error("Service not found");
      }
      const response = await authorizeServiceCallback(service, request.url);
      if (!response) {
        return new Response(JSON.stringify({ error: "Failed to authorize" }), {
          status: 500,
        });
      }

      const frontendRedirectUrl = process.env.FRONT_REDIRECT_SERVICES_URI!;
      return Response.redirect(frontendRedirectUrl);
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

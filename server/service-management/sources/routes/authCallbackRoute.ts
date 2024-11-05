import { z } from "zod";
import type { Route } from "../types";
import { authorizeServiceCallback } from "../controllers/oAuth4WebApiCallbackController";
import process from "node:process";
import { getSession } from "../controllers/sessionController";

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
      let service = new URLSearchParams(request.url.split("?")[1]).get(
        "service",
      );
      const state = new URLSearchParams(request.url.split("?")[1]).get("state");
      const session = await getSession(state!);
      const client_type = session.client_type;
      if (!service) {
        service = session.service;
        if (!service) {
          throw Error("Service not found");
        }
      }
      const auth_status = await authorizeServiceCallback(service, request.url);
      return responseToClient(client_type, auth_status);
    } catch (error) {
      console.log("Error in service callback", error);
      return new Response(
        JSON.stringify({ error: "Failed to authorize", information: error }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  },
};

const responseToClient = (client_type: string, auth_status: boolean) => {
  if (client_type === "mobile") {
    const color = auth_status ? "green" : "red";
    const message = auth_status ? "Successfully authorized to service" : "Failed to authorize to service";
    return new Response(`
      <html>
        <head>
          <style>
            body {
              display: flex;
              flex-direction: column; /* Stack items vertically */
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: Arial, sans-serif;
              background-color: #f0f0f0;
              margin: 0; /* Remove default margin */
            }
            h1 {
              font-size: 48px;
              color: ${color};
              margin-bottom: 20px; /* Space below the first heading */
            }
            h2 {
              font-size: 24px;
              color: black;
            }
          </style>
        </head>
        <body>
          <h1>${message}</h1>
          <h2>You can now close this window and return to the app.</h2>
        </body>
      </html>
    `, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  else {
    const FRONT_REDIRECT_SERVICES_URI = process.env.FRONT_REDIRECT_SERVICES_URI;
    return Response.redirect(`${FRONT_REDIRECT_SERVICES_URI}?auth_status=${auth_status}`!);
  }
};

export default route;

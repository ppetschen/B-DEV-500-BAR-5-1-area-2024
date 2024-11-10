import { getUserByToken } from "../controllers/userController";
import type { Route } from "../types";
import { z } from "zod";

const schema = z.never();

const route: Route<typeof schema> = {
    path: "/auth/redirect",
    method: "GET",
    schema,
    handler: async (request, _server) => {
        const token = new URLSearchParams(request.url.split("?")[1]).get(
            "token",);

        const userRequest = await getUserByToken(token!);

        return new Response(
            `
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
                color: green;
                margin-bottom: 20px; /* Space below the first heading */
              }
              h2 {
                font-size: 24px;
                color: black;
              }
            </style>
          </head>
          <body>
            <h1>Welcome to AREA ${userRequest.first_name}</h1>
            <h2>You can now close this window and return to the app.</h2>
          </body>
        </html>
      `,
            {
                headers: {
                    "Content-Type": "text/html",
                },
            },
        );
    },
};

export default route;

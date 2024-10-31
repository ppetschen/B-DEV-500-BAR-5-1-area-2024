import type { Route } from "../types";
import { z } from "zod";
import { getUserByToken } from "../controllers/userController";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/get-user",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    try {
      const token = request.headers.get("authorization")?.split("Bearer ")[1];
      const user = await getUserByToken(token!);

      return new Response(JSON.stringify(user), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
      return new Response(`Error retrieving user ${error}`, { status: 500 });
    }
  },
};

export default route;

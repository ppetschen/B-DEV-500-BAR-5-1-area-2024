import type { Route } from "../../types";
import { z } from "zod";
import { getUserById } from "../../controllers/userController";
import { getConsumerFromJWT } from "../../controllers/jwtController";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/whoami",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    const token = request.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      return new Response("Unauthorized, no token found", { status: 401 });
    }
    const consumer = await getConsumerFromJWT(token);

    const response = await getUserById(consumer);
    const user = await response.json();

    return new Response(JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
export default route;

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
    let user = await getConsumerFromJWT(token!);
    user = await getUserById(user);
    user = await user.json();

    return new Response(JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
export default route;

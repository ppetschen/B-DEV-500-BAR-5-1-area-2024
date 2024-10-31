import { getServicesByUserId } from "../../controllers/serviceController";
import { getUserByToken } from "../../controllers/userController";
import { customError, type Route } from "../../types";
import { z } from "zod";

const schema = z.any();

const route: Route<typeof schema> = {
  path: "/auth/get-services-by-user",
  method: "GET",
  schema,
  handler: async (request, _server) => {
    try {
      const token = request.headers.get("authorization")?.split("Bearer ")[1];
      const user = await getUserByToken(token!);
      if (!user) {
        throw new customError("User not found", 404);
      }
      const services = await getServicesByUserId(user.id);
      return new Response(
        JSON.stringify(services),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        return new Response(error.message, { status: error.status });
      }
      return new Response(`Error retrieving services by user`, { status: 500 });
    }
  },
};

export default route;

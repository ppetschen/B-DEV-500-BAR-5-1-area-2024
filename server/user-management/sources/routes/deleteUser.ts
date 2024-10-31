import { customError, type Route } from "../types";
import { z } from "zod";
import { host } from "../../utils";
import { getUserByToken } from "../controllers/userController";

const schema = z.never();

const route: Route<typeof schema> = {
  path: "/delete-user",
  method: "DELETE",
  schema,
  handler: async (request, _server) => {
    try {
      const token = request.headers.get("authorization")?.split("Bearer ")[1];

      const user = await getUserByToken(token!);

      const response = await fetch(
        host("DATABASE", "/user-management/delete-user"),
        {
          method: "DELETE",
          body: JSON.stringify({
            id: user.id,
          }),
        },
      );

      console.log(response);
      if (!response.ok) {
        throw new customError("There was an error while deleting user", 500);
      }
      return new Response(JSON.stringify({ message: "success" }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      if (error instanceof customError) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: {
            "Content-Type": "application/json",
          },
          status: error.status,
        });
      }
      return new Response("Internal server error", { status: 500 });
    }
  },
};

export default route;

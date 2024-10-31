import type { Route } from "../types";
import z from "zod";
import { hash } from "bcryptjs";
import { getUserByToken } from "../controllers/userController";
import { host } from "../utils";

const schema = z.object({
  new_password: z.string().optional().default(""),
  first_name: z.string().optional().default(""),
  last_name: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

const route: Route<typeof schema> = {
  path: "/update-user",
  method: "PUT",
  schema,
  handler: async (request, _server) => {
    try {
      const token = request.headers.get("authorization")?.split("Bearer ")[1];
      const {
        new_password,
        first_name,
        last_name,
        description,
      } = schema.parse(await request.json());

      const user = await getUserByToken(token!);

      const updatedUser = {
        id: user.id,
        email: user.email,
        password_hash: new_password != ""
          ? await hash(new_password, 10)
          : user.password_hash,
        first_name: first_name != "" ? first_name : user.first_name,
        last_name: last_name != "" ? last_name : user.last_name,
        description: description != "" ? description : user.description,
      };
      const response = await fetch(
        host("DATABASE", "/user-management/update-user"),
        {
          method: "PUT",
          body: JSON.stringify(updatedUser),
        },
      );
      if (!response.ok) {
        console.error(await response.text());
        return new Response("Error updating user", { status: 500 });
      }
      const newUser = await response.json();
      return new Response(JSON.stringify(newUser), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
      return new Response(`Error updating user ${error}`, { status: 500 });
    }
  },
};

export default route;

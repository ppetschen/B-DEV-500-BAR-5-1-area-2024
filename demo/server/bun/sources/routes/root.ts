import { type RouteInfo } from "$/main";

export const GET: RouteInfo = {
  url: "/",
  handler: async (_request, response) => {
    response.send({
      message: `Hello world from Bun v${Bun.version}!`,
    });
  },
};

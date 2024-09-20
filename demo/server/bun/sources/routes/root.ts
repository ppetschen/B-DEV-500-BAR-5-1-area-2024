import { type RouteInfo } from "$/main";

export const GET: RouteInfo = {
  url: "/",
  handler: async (_request, response) => {
    response.send({
      message: `Hello world from Bun v${Bun.version}!`,
    });
  },
};

export const OPTIONS: RouteInfo = {
  url: "/",
  handler: async (_request, response) => {
    response.code(204)
      .header("access-control-allow-methods", "GET")
      .header("access-control-allow-origin", "*")
      .send();
  },
};

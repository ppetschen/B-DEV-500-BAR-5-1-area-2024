import { type RouteInfo } from "$/main";
import { createNewTodo, getAllTodos } from "$/database";

// Retrieves all todo objects available
export const GET: RouteInfo = {
  url: "/todo",
  handler: async (_request, response) => {
    try {
      const data = await getAllTodos();
      response.send({ data });
    } catch (error) {
      response.status(500).send({
        error: error instanceof Error
          ? error.message
          : `Unknown error occurred, please try again later`,
      });
    }
  },
};

// Creates a new todo object. A random unique value for
// ID should be automatically generated in backend or in the db.
export const POST: RouteInfo = {
  url: "/todo",
  handler: async (request, response) => {
    try {
      const data = await createNewTodo({
        id: crypto.randomUUID(),
        // @ts-ignore(jabolo): This is a POC, and zod
        // not infering the schema properly is out of the
        // scope of this example
        ...request.body,
      });
      response.send({ data });
    } catch (error) {
      response.status(500).send({
        error: error instanceof Error
          ? error.message
          : `Unknown error occurred, please try again later`,
      });
    }
  },
};

export const OPTIONS: RouteInfo = {
  url: "/todo",
  handler: async (_request, response) => {
    response.code(204)
      .header("access-control-allow-methods", "GET, POST")
      .header("access-control-allow-origin", "*")
      .send();
  },
};

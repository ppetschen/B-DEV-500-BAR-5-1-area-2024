import { type RouteInfo } from "$/main";
import { createNewTodo, getAllTodos } from "$/database";
import { z } from "zod";

// Retrieves all todo objects available
export const GET: RouteInfo = {
  url: "/todo",
  handler: async (_request, response) => {
    try {
      const data = await getAllTodos();
      response.send({ data });
    } catch {
      response.status(500).send({
        error: "An error occurred while retrieving all todos",
      });
    }
  },
};

// Creates a new todo object. A random unique value for
// ID should be automatically generated in backend or in the db.
export const POST: RouteInfo = {
  url: "/todo",
  schema: {
    body: z.object({
      title: z.string().min(1).max(100),
      description: z.string().max(500),
      completed: z.boolean(),
    }),
  },
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
    } catch {
      response.status(500).send({
        error: "An error occurred while creating a new todo",
      });
    }
  },
};

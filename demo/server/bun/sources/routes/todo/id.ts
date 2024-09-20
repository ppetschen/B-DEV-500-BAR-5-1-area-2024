import { deleteTodoById, getTodoById, updateTodoById } from "$/database";
import { type RouteInfo } from "$/main";

// Retrieve one todo object based on the provided ID
export const GET: RouteInfo = {
  url: "/todo/:id",
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await getTodoById(request.params.id);
      response.send({ data: todo });
    } catch (error) {
      response.status(500).send({
        error: error instanceof Error
          ? error.message
          : `Unknown error occurred, please try again later`,
      });
    }
  },
};

// Permanently deletes the todo object specified by its ID.
export const DELETE: RouteInfo = {
  url: "/todo/:id",
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await deleteTodoById(request.params.id);
      response.send({ data: todo });
    } catch (error) {
      response.status(500).send({
        error: error instanceof Error
          ? error.message
          : `Unknown error occurred, please try again later`,
      });
    }
  },
};

// Updates an entire object, replacing its current state.
export const PUT: RouteInfo = {
  url: "/todo/:id",
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await updateTodoById(request.params.id, request.body);
      response.send({ data: todo });
    } catch (error) {
      response.status(500).send({
        error: error instanceof Error
          ? error.message
          : `Unknown error occurred, please try again later`,
      });
    }
  },
};

// Updates an object partially, modifying only fields specified in the body.
export const PATCH: RouteInfo = {
  url: "/todo/:id",
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await updateTodoById(request.params.id, request.body);
      response.send({ data: todo });
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
  url: "/todo/:id",
  handler: async (_request, response) => {
    response.code(204)
      .header("access-control-allow-methods", "GET, DELETE, PUT, PATCH")
      .header("access-control-allow-origin", "*")
      .send();
  },
};

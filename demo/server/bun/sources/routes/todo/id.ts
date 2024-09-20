import { deleteTodoById, getTodoById, updateTodoById } from "$/database";
import { type RouteInfo } from "$/main";
import { z } from "zod";

// Retrieve one todo object based on the provided ID
export const GET: RouteInfo = {
  url: "/todo/:id",
  schema: {
    params: {
      id: z.string().uuid(),
    },
  },
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await getTodoById(request.params.id);
      response.send({ data: todo });
    } catch {
      response.status(500).send({
        error: "An error occurred while retrieving the todo",
      });
    }
  },
};

// Permanently deletes the todo object specified by its ID.
export const DELETE: RouteInfo = {
  url: "/todo/:id",
  schema: {
    params: {
      id: z.string().uuid(),
    },
  },
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await deleteTodoById(request.params.id);
      response.send({ data: todo });
    } catch {
      response.status(500).send({
        error: "An error occurred while retrieving the todo",
      });
    }
  },
};

// Updates an entire object, replacing its current state.
export const PUT: RouteInfo = {
  url: "/todo/:id",
  schema: {
    body: z.object({
      title: z.string().min(1).max(100),
      description: z.string().max(500),
      completed: z.boolean(),
    }),
  },
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await updateTodoById(request.params.id, request.body);
      response.send({ data: todo });
    } catch {
      response.status(500).send({
        error: "An error occurred while updating the todo",
      });
    }
  },
};

// Updates an object partially, modifying only fields specified in the body.
export const PATCH: RouteInfo = {
  url: "/todo/:id",
  schema: {
    body: z.object({
      title: z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
      completed: z.boolean().optional(),
    }),
  },
  handler: async (request, response) => {
    try {
      // @ts-ignore(jabolo): This is a POC, and zod
      // not infering the schema properly is out of the
      // scope of this example
      const todo = await updateTodoById(request.params.id, request.body);
      response.send({ data: todo });
    } catch {
      response.status(500).send({
        error: "An error occurred while updating the todo",
      });
    }
  },
};

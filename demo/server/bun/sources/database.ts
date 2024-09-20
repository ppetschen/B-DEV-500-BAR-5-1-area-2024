import { type TodoItem } from "@internal/area";
import postgres from "postgres";

export const TABLE_NAME = "todos";

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export const getVersion = async () => {
  const [{ version }] = await sql<[{ version: string }]>`SELECT version()`;
  return version;
};

export const initTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      completed BOOLEAN NOT NULL
    )
  `;
};

export const getAllTodos = async () => {
  return sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`SELECT * FROM ${TABLE_NAME}`;
};

export const createNewTodo = async ({
  id,
  title,
  description,
  completed,
}: TodoItem) => {
  return sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`
    INSERT INTO ${TABLE_NAME} (id, title, description, completed)
    VALUES (${id}, ${title}, ${description}, ${completed})
  `;
};

export const getTodoById = async (id: string) => {
  return sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`SELECT * FROM ${TABLE_NAME} WHERE id = ${id}`;
};

export const deleteTodoById = async (id: string) => {
  return sql`DELETE FROM ${TABLE_NAME} WHERE id = ${id}`;
};

export const updateTodoById = async (id: string, data: Partial<TodoItem>) => {
  return sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`
    UPDATE ${TABLE_NAME}
    SET ${Object.entries(data).map(([key, value]) => `${key} = ${value}`)}
    WHERE id = ${id}
  `;
};

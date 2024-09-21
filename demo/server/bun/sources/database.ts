import { type TodoItem } from "@internal/area";
import postgres from "postgres";

const TABLE_NAME = `todos`;

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
  const allTables = await sql<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;

  const exists = allTables.some(({ table_name }) => table_name === TABLE_NAME);
  if (!exists) {
    await sql`
      CREATE TABLE ${sql(TABLE_NAME)} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        completed BOOLEAN NOT NULL
      )
    `;
  }
};

export const getAllTodos = async () =>
  await sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`SELECT * FROM ${sql(TABLE_NAME)}`;

export const createNewTodo = async ({
  id,
  title,
  description,
  completed,
}: TodoItem) =>
  await sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`
    INSERT INTO ${sql(TABLE_NAME)} (id, title, description, completed)
    VALUES (${id}, ${title}, ${description}, ${completed})
  `;

export const getTodoById = async (id: string) =>
  await sql<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }[]>`SELECT * FROM ${sql(TABLE_NAME)} WHERE id = ${id} LIMIT 1`;

export const deleteTodoById = async (id: string) =>
  await sql`DELETE FROM ${sql(TABLE_NAME)} WHERE id = ${id}`;

export const updateTodoById = async (id: string, data: Partial<TodoItem>) => {
  const [old] = await getTodoById(id);
  if (!old) {
    throw new Error(`Todo with ID ${id} not found`);
  }

  const updated = { ...old, ...data };

  await sql`
    UPDATE ${sql(TABLE_NAME)}
    SET title = ${updated.title},
        description = ${updated.description},
        completed = ${updated.completed}
    WHERE id = ${id}
  `;
};

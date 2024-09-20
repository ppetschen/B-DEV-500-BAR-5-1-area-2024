declare module "bun" {
  interface Env {
    POSTGRES_HOST: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
  }
}

declare module "@internal/area" {
  interface TodoItem {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }
}

export type User = {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  description: string;
  services: string[];
  created_at: Date;
  updated_at: Date;
};

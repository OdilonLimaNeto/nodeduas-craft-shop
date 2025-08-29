import { User } from "./user";

export interface AuthenticatedUser {
  access_token: string;
  refresh_token: string;
  user: User & {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

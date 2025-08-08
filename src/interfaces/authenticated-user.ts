import { User } from "./user";

export interface AuthenticatedUser {
  token: string;
  user: User;
}

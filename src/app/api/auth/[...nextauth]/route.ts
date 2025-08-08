import { nextAuthOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuthOptions) as never;

export { handler as GET, handler as POST };

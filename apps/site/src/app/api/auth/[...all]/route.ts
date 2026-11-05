import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// Better Auth's own endpoints: the GitHub callback, sessions and sign-out. This is the one Route
// Handler that doesn't check the admin session first, because it is where the session is made
// (.claude/rules/server.md); Better Auth turns away every account but Nadav's (lib/auth.ts).
export const { GET, POST } = toNextJsHandler((request) => getAuth().handler(request));

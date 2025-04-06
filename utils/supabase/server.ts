// utils/supabase/server.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export function createServerComponentClientWithCookies() {
  return createServerComponentClient({ cookies })
}

export { createServerComponentClientWithCookies as createServerComponentClient }

export const getServerSupabaseClient = () =>
  createServerComponentClient({ cookies })
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for use in client components
export function createClientComponentClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anonymous Key is missing. Check your environment variables.")
    // Return a dummy client that will throw clear errors
    return createClient("https://placeholder-url.supabase.co", "placeholder-key", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}


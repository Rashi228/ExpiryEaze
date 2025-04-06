// These would normally come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Database types
export type User = {
  id: string
  name: string
  email: string
  phone?: string
  location: string
  role: "user" | "vendor"
  category: "groceries" | "medicines" | "pending"
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string
  original_price: number
  discounted_price: number
  discount: string
  expiry_date: string
  quantity: number
  vendor_id: string
  vendor: string
  category: string
  requires_prescription?: boolean
  image_url: string
  created_at: string
}

export type Order = {
  id: string
  user_id: string
  total_amount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

// Note: We're not creating the client here anymore
// Instead, we'll use the createClient function from utils/supabase/server.ts for server components
// and utils/supabase/client.ts for client components


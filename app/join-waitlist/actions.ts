"use server"

import { getServerSupabaseClient } from "@/utils/supabase/server"
export async function submitWaitlistForm(formData: FormData): Promise<{
  success: boolean
  error?: string
  redirectTo?: string
}> {
  const supabase = getServerSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const location = formData.get("location") as string
  const role = formData.get("role") as "user" | "vendor"
  const userId = formData.get("userId") as string

  if (!name || !email || !location || !role || !userId) {
    return { success: false, error: "All required fields must be filled" }
  }

  try {
    // Update user information
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        phone: phone || null,
        location,
        role,
        category: "pending", // Will be updated after category selection
      })
      .eq("id", userId)

      if (updateError) {
        console.error("Error updating user information:", updateError)
        return { success: false, error: `Failed to update user information: ${updateError.message}` }
      }

    // Return success with redirect info instead of redirecting directly
    return {
      success: true,
      redirectTo:
        role === "vendor" ? `/vendor-category-selection?userId=${userId}` : `/user-category-selection?userId=${userId}`,
    }
  } catch (error: any) {
    console.error("Error submitting waitlist form:", error)
    return {
      success: false,
      error: `Failed to submit form. Please try again. Error: ${error.message}`,
    }
}
}

export async function updateUserCategory(userId: string, category: "groceries" | "medicines"): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = getServerSupabaseClient()

    const { error } = await supabase
      .from("users")
      .update({ category })
      .eq("id", userId)

    if (error) {
      console.error("Error updating user category:", error)
      return { success: false, error: `Failed to update category: ${error.message}` }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error updating user category:", error)
    return {
      success: false,
      error: `Failed to update category. Please try again. Error: ${error.message}`,
    }
  }
}



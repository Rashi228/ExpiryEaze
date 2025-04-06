"use server"

import { updateUserCategory } from "@/app/join-waitlist/actions"

export async function selectUserCategory(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const category = formData.get("category") as "groceries" | "medicines"

    if (!userId || !category) {
      return { error: "Missing required information" }
    }

    const result = await updateUserCategory(userId, category)

    // Check if result is undefined or null before using 'in' operator
    if (!result) {
      return { error: "Failed to update category. Please try again." }
    }

    // Check if result is an object with an error property
    if (typeof result === "object" && "error" in result) {
      return result
    }

    // Return success with redirect info instead of redirecting directly
    return {
      success: true,
      redirectTo: category === "groceries" ? "/user-dashboard" : "/medicines-dashboard",
    }
  } catch (error: any) {
    console.error("Error selecting category:", error)
    return { error: `Failed to select category. Please try again. Error: ${error.message}` }
  }
}


"use server"

import { updateUserCategory } from "@/app/join-waitlist/actions"

export async function selectVendorCategory(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const category = formData.get("category") as "groceries" | "medicines"

    if (!userId || !category) {
      return { error: "Missing required information" }
    }

    const result = await updateUserCategory(userId, category)

    // Check if result has an error
    if (typeof result === "object" && "error" in result) {
      return { error: result.error || "Failed to update category. Please try again." }
    }

    // Redirect to the correct page based on selection
    // For groceries, go directly to vendor dashboard
    // For medicines, go to verification page
    return {
      success: true,
      redirectTo: category === "groceries" ? "/vendor-dashboard" : "/medicine-vendor-verification",
    }
  } catch (error: any) {
    console.error("Error selecting category:", error)
    return { error: `Failed to select category. Please try again. Error: ${error.message}` }
  }
}


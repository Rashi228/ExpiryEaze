"use server"

import { createServerComponentClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"


export async function createCheckoutSession(formData: FormData) {
  try {
    const supabase = createServerComponentClient()

    const userId = formData.get("userId") as string
    const cartItems = JSON.parse(formData.get("cartItems") as string)
    const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)

    if (!userId || !cartItems || !totalAmount) {
      return { error: "Missing required information" }
    }

    // Create order in database
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating order:", error)
      return { error: `Failed to create order: ${error.message}` }
    }

    const orderId = order?.[0]?.id

    // Add order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error adding order items:", itemsError)
      return { error: `Failed to add order items: ${itemsError.message}` }
    }

    // Redirect to checkout page with amount
    redirect(`/checkout?amount=${totalAmount}&orderId=${orderId}`)
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return { error: `Failed to create checkout session: ${error.message}` }
  }
}


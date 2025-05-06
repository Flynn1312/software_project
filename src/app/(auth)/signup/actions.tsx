"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcrypt"

// Define validation schema
const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUserAction(prevState: any, formData: FormData) {
  try {
    // Extract form data
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate form data
    const validationResult = UserSchema.safeParse({
      username,
      email,
      password,
    })

    if (!validationResult.success) {
      return {
        error: validationResult.error.errors[0].message,
        success: false,
      }
    }

    // Create Supabase client
    const supabase = createClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return {
        error: "User with this email or username already exists",
        success: false,
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    const { error } = await supabase.from("users").insert({
      username,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Database error:", error)
      return {
        error: "Failed to create account. Please try again.",
        success: false,
      }
    }

    // Sign up was successful
    return {
      error: null,
      success: true,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      error: "An unexpected error occurred. Please try again.",
      success: false,
    }
  }
}

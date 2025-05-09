"use server"

import { queryData } from "@/actions/createConnection"

export async function registerUserAction(prevState: any, formData: FormData) {

  try {
    const username = formData.get("username") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string

    // Checks that all fields have been filled in
    if (!username || !name || !password) {
      return {
        ...prevState,
        error: "All fields are required",
        data: null,
      }
    }

    const existingUsers = (await queryData("SELECT * FROM idb.users WHERE username = ?", [username])) as any[]

    if (existingUsers.length > 0) {
      return {
        ...prevState,
        error: "Username already exists",
        data: null,
      }
    }

    await queryData("INSERT INTO idb.users (username, name, password) VALUES (?, ?, ?)", [
      username,
      name,
      password,
    ])

    await queryData(
      "INSERT INTO idb.details (username, income, goal, saved, goal_date) VALUES (?, ?, ?, ?, ?)",
      [username, 0, 0, 0, new Date().toISOString().split("T")[0]],
    )

    return {
      ...prevState,
      error: null,
      data: "User registered successfully",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      ...prevState,
      error: "Failed to register user",
      data: null,
    }
  }
}
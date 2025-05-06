"use server"

import { createConnection } from "@/actions/createConnection"

export async function getData(userIdOrFormData) {
  "use server"

  let username
  let userId

  // Check if the parameter is formData or userId (string)
  if (userIdOrFormData && typeof userIdOrFormData === "object" && userIdOrFormData.get) {
    // It's formData
    username = userIdOrFormData.get("username")
  } else if (userIdOrFormData && typeof userIdOrFormData === "string") {
    // It's a userId string
    userId = userIdOrFormData
  } else {
    // For handling calls without parameters, we'll use a default username for testing
    username = "User1" // Using a default user from your CSV
  }

  try {
    const connection = await createConnection()
    let query
    let params

    // Build query based on what we have (userId or username)
    if (userId) {
      query = `
                SELECT * FROM idb.details
                WHERE id = ?
                LIMIT 1;
            `
      params = [userId]
    } else {
      query = `
                SELECT * FROM idb.details
                WHERE username = ?
                LIMIT 1;
            `
      params = [username]
    }

    // Execute the query
    const [results, fields] = await connection.query(query, params)
    connection.end()

    // Handle case where user is not found
    if (!results || results.length === 0) {
      console.log("No user found for", userId ? `userId: ${userId}` : `username: ${username}`)
      return { username: null, income: 0 }
    }

    const user = results[0]

    // Log successful data retrieval
    console.log("Data retrieved for user:", user.username)

    return {
      username: user.username,
      income: user.income,
      goal: user.goal,
      saved: user.saved,
      goal_date: user.goal_date,
      business: user.business,
    }
  } catch (error) {
    console.error("Error in getData:", error)
    return { username: null, income: 0, error: error.message }
  }
}

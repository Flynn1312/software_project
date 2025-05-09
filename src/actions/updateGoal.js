"use server"
import { createConnection } from "./createConnection"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 @param {FormData} formData
 @returns {Promise<boolean>} 
 */
export async function updateGoal(formData) {
  try {
    
    // Pull the data from the form
    const targetAmount = Number.parseFloat(formData.get("targetAmount"))
    const currentAmount = Number.parseFloat(formData.get("currentAmount"))
    const deadline = new Date(formData.get("deadline"))
    const username = formData.get("username")

    if (isNaN(targetAmount) || isNaN(currentAmount) || !deadline || !username) {
      console.error("Invalid form data:", {
        targetAmount: isNaN(targetAmount) ? "invalid" : targetAmount,
        currentAmount: isNaN(currentAmount) ? "invalid" : currentAmount,
        deadline: !deadline ? "missing" : deadline,
        username: !username ? "missing" : "ok"
      });
      return false;
    }

    // YYYY-MM-DD
    const formattedDeadline = deadline.toISOString().split("T")[0]

    // Format amounts as £
    const formattedGoal = `£${targetAmount.toFixed(2)}`
    const formattedSaved = `£${currentAmount.toFixed(2)}`

    const connection = await createConnection()
    
    try {
      // Check if a goal already exists for this user
      const [existingGoals] = await connection.query("SELECT * FROM idb.details WHERE username = ?", [username])

      let query
      let params

      if (existingGoals.length > 0) {
        query = `
          UPDATE idb.details 
          SET  goal = ?, saved = ?, 
              goal_date = ?
          WHERE username = ?
        `
        params = [
          formattedGoal,
          formattedSaved,
          formattedDeadline,
          username,
        ]
      } else {
        query = `
          INSERT INTO idb.details 
          (username, goal, saved, goal_date, business)
          VALUES (?, ?, ?, ?, 'no')
        `
        params = [
          username,
          formattedGoal,
          formattedSaved,
          formattedDeadline,
        ]
      }

      const result = await connection.query(query, params)

      revalidatePath("/")
      

      return true;
    } finally {
      connection.end()
    }
  } catch (error) {
    console.error("Error updating goal:", error);
    return false;
  }
}
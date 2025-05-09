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
    
    // Pull data from the form
    const currentAmount = Number.parseFloat(formData.get("currentAmount"))
    const username = formData.get("username")

    if (isNaN(currentAmount) || !username) {
      console.error("Invalid form data:", {
        currentAmount: isNaN(currentAmount) ? "invalid" : currentAmount,
        username: !username ? "missing" : "ok"
      });
      return false;
    }

    // Format amounts as £
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
          SET  saved = ?
          WHERE username = ?
        `
        params = [
          formattedSaved,
          username,
        ]
      } else {
        query = `
          INSERT INTO idb.details 
          (username, saved)
          VALUES (?, ?)
        `
        params = [
          username,
          formattedSaved,
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
"use server"

import { createConnection } from "@/actions/createConnection"

export async function getData(FormData) {
  "use server"

  let username

    username = FormData

  try {
    const connection = await createConnection()
    let query
    let params

    if (username) {
      query = `
                SELECT * FROM idb.details
                WHERE username = ?
                LIMIT 1;
            `
      params = [username]
    }

    const [results, fields] = await connection.query(query, params)
    connection.end()

    // if the user isnt found
    if (!results || results.length === 0) {
      return { username: null, income: 0 }
    }

    const user = results[0]

    return {
      username: user.username,
      income: user.income,
      goal: user.goal,
      saved: user.saved,
      goal_date: user.goal_date,
      business: user.business,
    }
  } catch (error) {
    return { 
      username: null, 
      income: 0, 
      error: `Database error: ${error.message}. Code: ${error.code || 'unknown'}` 
    }
  }
}
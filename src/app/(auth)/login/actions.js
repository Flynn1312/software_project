"use server"

import { createConnection } from "@/actions/createConnection"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
    const connection = await createConnection()
  
    try {
      const [columns] = await connection.query("SHOW COLUMNS FROM users")
      return NextResponse.json({ columns })
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } finally {
      connection.end()
    }
  }
export async function login(formData) {
	"use server"

	let username = formData.get("username")
	let password = formData.get("password")

	const connection = await createConnection()
	const [results, fields] = await connection.query(
		`
		SELECT * FROM users
        WHERE username = ? AND password = ?
		LIMIT 1;
	`,
		[username, password]
	)
	connection.end()

	if (results.length === 0) {
		return { error: "Invalid credentials" }
	}

	const user = results[0]

	// just for testing purposes
	const cookieStore = await cookies()
	cookieStore.set("username", user.username)
	cookieStore.set("password", user.password)

	redirect("/")
	return { success: "Login successful!" }
}
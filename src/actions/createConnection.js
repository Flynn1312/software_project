"use server"
import mysql2 from "mysql2/promise"

export async function createConnection() {
	const connection = await mysql2.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
	})

	return connection
}

export async function queryData(query, params = []) {
	const connection = await createConnection()
	const [rows, fields] = await connection.query(query, params)
	connection.end()

	return rows
}
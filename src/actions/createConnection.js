"use server"
import mysql2 from "mysql2/promise"

export async function createConnection() {
	const connection = await mysql2.createConnection({
		host: "localhost",
		user: "root",
		password: "Osborne13!",
		database: "IndividualProject",
		port: "3306",
	})

	return connection
}

export async function queryData(query, params = []) {
	const connection = await createConnection()
	const [rows, fields] = await connection.query(query, params)
	connection.end()

	return rows
}
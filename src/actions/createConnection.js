"use server"
import mysql2 from "mysql2/promise"

export async function createConnection() {
  try {
    console.log("Creating database connection...");
    const connection = await mysql2.createConnection({
      host: "localhost",
      user: "root",
      password: "Osborne13!",
      database: "idb",
      port: 3306,  
    });
    return connection;
  } catch (error) {
    console.error("Error creating database connection:", error);
    throw error;
  }
}

export async function queryData(query, params = []) {
  let connection;
  try {
    connection = await createConnection();
    const [rows, fields] = await connection.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
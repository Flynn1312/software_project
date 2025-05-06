"use server"

import { NextResponse } from "next/server"
import { createConnection } from "./createConnection"
import { verifyLogin } from "./verifyLogin"

export async function createAccount({username, name, business, password}) {
    const user = await verifyLogin()

    if (!user) {
        return { error: "Not logged in" }
        // return NextResponse.json({message: "Not logged in"}, {status: 401})
    }

    if (business == "no"){
        business=null
    }

        const connection = await createConnection()
        connection.query(
            `
        INSERT INTO user(username, name, business, password)
        VALUES (?, ?, ?, ?);
    `,
            [username, name, business, password]
        )
        connection.end()
        return { success: "Account Created" }
    } 
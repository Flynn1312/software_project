import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const username = cookieStore.get("username")?.value

  return Response.json({
    username: username || null,
  })
}

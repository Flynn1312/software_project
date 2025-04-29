"use server"

import Link from "next/link"
import { login } from "@/app/(auth)/login/actions"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SigninForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    const res = await login(formData)

    if (res.error) {
      setError(res.error)
      alert(res.error)
    } else if (res.success) {
      alert(res.success)
      setIsLoggedIn(true)
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your details to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?
        <Link className="underline ml-2" href="signup">
          Sign Up
        </Link>
      </div>
    </div>
  )
}


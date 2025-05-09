"use client"

import Link from "next/link"
import { useActionState } from "react"
import { registerUserAction } from "../data/actions/auth-actions"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const INITIAL_STATE = {
  data: "",
}

export function SignupForm() {
  const router = useRouter()
  const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE)

  console.log(formState, "client")
  
  useEffect(() => {
    if (formState?.data === "User registered successfully") {
      router.push("/income")
    }
  }, [formState, router])

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {formState?.error && <div className="text-red-500 text-sm w-full">{formState.error}</div>}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
            >
              Sign Up
            </button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="login">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}
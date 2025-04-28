"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerUserAction } from "../data/actions/auth-actions";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const INITIAL_STATE = {
  data: "",
};

export function SignupForm() {
  const [formState, formAction] = useActionState(registerUserAction, INITIAL_STATE);
  
  console.log(formState, "client");
  
  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Email</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
          <Link href="income" className="w-full">
            <button type ="submit"className="w-full">Sign Up</button>
            </Link>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Need a business account?
          <Link className="underline ml-2" href="business_login">
            Sign Up
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="login">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
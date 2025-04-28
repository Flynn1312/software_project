"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
export default function Settings() {
  return (
    <div className="min-h-screen items-center justify-center flex">
      <div className="min-w-[500px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
          <Link href="/setgoal" className="w-full block">
          <Button type="submit" className="w-full">
                  Change Goal
                </Button>
            </Link>
            <Link href="/income" className="w-full block">
           <Button type="submit" className="w-full">
                  Change Income
                </Button> 
                </Link>
            <Link href="/" className="w-full block">
            <Button type="submit" className="w-full">
                  Change Password
                </Button>
                </Link>
            <Link href="/" className="w-full block">
            <Button type="submit" className="w-full">
                  Home
                </Button>
                </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
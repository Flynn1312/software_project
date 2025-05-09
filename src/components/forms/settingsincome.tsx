"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { updateIncome } from "@/actions/updateIncome"

export default function SettingsIncomeForm({ username }: { username?: string }) {
  const [incomeType, setIncomeType] = useState("monthly")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const router = useRouter()

  // Try to get username from props or sessionStorage
  useEffect(() => {
    // Only run this once on initial mount
    if (username) {
      setCurrentUser(username)
    } else if (typeof window !== "undefined") {
      const storedUsername = sessionStorage.getItem("username")
      if (storedUsername) {
        setCurrentUser(storedUsername)
      }
    }
  }, []) // Empty dependency array so it only runs once

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid income amount")
      return
    }

    if (!currentUser) {
      setError("No user is currently logged in or selected")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateIncome(currentUser, Number.parseFloat(amount), incomeType)

      if (result) {
        setSuccess(true)
        router.push("/")
      } else {
        console.error("Income update returned false")
        throw new Error("Failed to update income")
      }
    } catch (error) {
      console.error("Error updating income:", error)
      setError("There was a problem updating your income. Please check the console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Update Income</CardTitle>
            <CardDescription>
              {currentUser
                ? `Adding income details for ${currentUser}`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {!username && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className="text-base"
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="income-type">Income Type</Label>
              <RadioGroup value={incomeType} onValueChange={setIncomeType} id="income-type" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="font-normal">
                    Monthly Income
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <Label htmlFor="yearly" className="font-normal">
                    Yearly Income
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (£)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="text-base"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
              />
              <p className="text-sm text-muted-foreground">
                Enter your {incomeType === "monthly" ? "monthly" : "yearly"} income amount.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting || success || !currentUser}>
              {isSubmitting ? "Saving..." : success ? "Saved!" : "Save Income"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

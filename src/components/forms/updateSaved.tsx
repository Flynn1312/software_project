"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateGoal } from "@/actions/amountSaved"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
// duplicate of goal.tsx but altered to fit this purpose

const usernameFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function SavingsGoalPage() {
  const [usernameConfirmed, setUsernameConfirmed] = useState(false)
  const [confirmedUsername, setConfirmedUsername] = useState("")
  const router = useRouter()

  // State for the goal form
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [currentAmount, setCurrentAmount] = useState<number | string>("")

  // Initialize the username form
  const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  })

  // Try to get username from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username")
      console.log("Stored username from localStorage:", storedUsername)

      if (storedUsername && storedUsername.length > 1) {
        usernameForm.setValue("username", storedUsername)
        setConfirmedUsername(storedUsername)
        setUsernameConfirmed(true)
      }
    }
  }, [usernameForm])

  // Handle username submission
  function onUsernameSubmit(values: z.infer<typeof usernameFormSchema>) {
    const { username } = values

    // Save username and mark as confirmed
    setConfirmedUsername(username)
    setUsernameConfirmed(true)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("username", username)
      // Save to session storage
      sessionStorage.setItem("username", username)
    }

    // Reset goal form fields
    setCurrentAmount("")
  }

  // Handle goal form submission
  async function onGoalSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      // Validate inputs

      const currentAmountNum = typeof currentAmount === 'string' ? 
        parseFloat(currentAmount) : currentAmount;
        
      if (isNaN(currentAmountNum) || currentAmountNum < 0) {
        setError("Please enter a valid current amount")
        setIsSubmitting(false)
        return
      }

      console.log("Submitting form with values:", {
        username: confirmedUsername,
        currentAmount: currentAmountNum,
      });

      const formData = new FormData()
      formData.append("username", confirmedUsername)
      formData.append("currentAmount", currentAmountNum.toString())

      try {
        const result = await updateGoal(formData)
        
        if (result) {
          setSuccess(true)
          
            router.push("/")

        } else {
          setError("Failed to save goal")
          console.error("Failed to save goal")
        }
      } catch (actionError) {
        console.error("Server action error:", actionError)
        setError("Error saving goal: " + (actionError instanceof Error ? actionError.message : "Unknown error"))
      }
    } catch (error) {
      console.error("Error saving goal:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!usernameConfirmed) {
    return (
      <div className="container mx-auto min-h-screen items-center justify-center flex">
        <div className="flex flex-col items-center space-y-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Enter Your Username</CardTitle>
              <CardDescription>Please enter your username to continue to the savings goal form.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...usernameForm}>
                <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
                  <FormField
                    control={usernameForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormDescription>This will be used to save your goal information.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create a Savings Goal</CardTitle>
            <CardDescription>
              Set up a new savings goal for user: <span className="font-medium">{confirmedUsername}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">{error}</div>}
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
                Goal saved successfully! Redirecting to dashboard...
              </div>
            )}
            
            <form onSubmit={onGoalSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount (£)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Enter how much you have saved now</p>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUsernameConfirmed(false)
                  }}
                  className="flex-1"
                >
                  Change Username
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting || success}>
                  {isSubmitting ? "Saving..." : success ? "Saved!" : "Save Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { updateGoal } from "@/actions/updateGoal"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"


const usernameFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function SavingsGoalPage() {
  const [usernameConfirmed, setUsernameConfirmed] = useState(false)
  const [confirmedUsername, setConfirmedUsername] = useState("")
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [targetAmount, setTargetAmount] = useState<number | string>("")
  const [currentAmount, setCurrentAmount] = useState<number | string>("")
  const [deadline, setDeadline] = useState<Date>(new Date())

  const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  })

  // Try to get username from localStorage 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username")

      if (storedUsername && storedUsername.length > 1) {
        usernameForm.setValue("username", storedUsername)
        setConfirmedUsername(storedUsername)
        setUsernameConfirmed(true)
      }
    }
  }, [usernameForm])


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
    setTargetAmount("")
    setCurrentAmount("")
    setDeadline(new Date())
  }

  async function onGoalSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      //Make sure inputs are valid
      const targetAmountNum = typeof targetAmount === 'string' ? 
        parseFloat(targetAmount) : targetAmount;
        
      if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
        setError("Please enter a valid target amount")
        setIsSubmitting(false)
        return
      }

      const currentAmountNum = typeof currentAmount === 'string' ? 
        parseFloat(currentAmount) : currentAmount;
        
      if (isNaN(currentAmountNum) || currentAmountNum < 0) {
        setError("Please enter a valid current amount")
        setIsSubmitting(false)
        return
      }

      console.log("Submitting form with values:", {
        username: confirmedUsername,
        targetAmount: targetAmountNum,
        currentAmount: currentAmountNum,
        deadline: deadline.toISOString()
      });

      const formData = new FormData()
      formData.append("username", confirmedUsername)
      formData.append("targetAmount", targetAmountNum.toString())
      formData.append("currentAmount", currentAmountNum.toString())
      formData.append("deadline", deadline.toISOString())

      try {
        const result = await updateGoal(formData)
        
        if (result) {
          console.log("Goal saved successfully")
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
// Gets the ujser to enter their username (had trouble taking the username from the last form)
  if (!usernameConfirmed) {
    return (
      <div className="container mx-auto py-10">
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
            <CardTitle>Savings Goal</CardTitle>
            <CardDescription>
              Setting up a savings goal for user: <span className="font-medium">{confirmedUsername}</span>
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
                <Label htmlFor="targetAmount">Target Amount (£)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">How much do you need to save in total?</p>
              </div>

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
                <p className="text-sm text-muted-foreground">How much have you saved so far?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="deadline" variant={"outline"} className="w-full pl-3 text-left font-normal">
                      {deadline ? format(deadline, "PPP") : "Select a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date) => date && setDeadline(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-sm text-muted-foreground">When do you want to reach your savings goal?</p>
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
"use client"

import Link from "next/link"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

const formSchema = z.object({
  goalName: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  targetAmount: z.coerce.number().positive({
    message: "Target amount must be a positive number.",
  }),
  currentAmount: z.coerce.number().min(0, {
    message: "Current amount must be a positive number or zero.",
  }),
  deadline: z.date({
    required_error: "A deadline is required.",
  }),
  notes: z.string().optional(),
})

export default function SavingsGoalPage() {
  const [progress, setProgress] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalName: "",
      targetAmount: 0,
      currentAmount: 0,
      notes: "",
      deadline: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Calculate progress percentage
    const progressPercentage = Math.min(Math.round((values.currentAmount / values.targetAmount) * 100), 100)
    setProgress(progressPercentage)
    setIsSubmitted(true)

    // Here you would typically save the goal to a database
    console.log(values)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create a Savings Goal</CardTitle>
            <CardDescription>Set up a new savings goal and track your progress over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="goalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="New Car, Vacation, etc." {...field} />
                      </FormControl>
                      <FormDescription>Give your savings goal a meaningful name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount (£)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>How much do you need to save in total?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Amount (£)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>How much have you saved so far?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Target Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value ? "text-muted-foreground" : ""
                              }`}
                            >
                              {field.value ? format(field.value, "PPP") : "Select a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>When do you want to reach your savings goal?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Link href="/" className="w-full">
                <Button type="submit" className="w-full">
                  Save Goal
                </Button>
                </Link>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { getData } from "@/actions/getData"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Define the type for chart data
type ChartDataItem = {
  month: string
  Income: number
}

// Define the type for user data
type UserData = {
  username: string | null
  income: number | string
  goal?: number
  saved?: number
  goal_date?: string
  business?: string
  error?: string
}

// Props to accept current user ID
interface IncomeProps {
  userId?: string
}

export function Income({ userId }: IncomeProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reset states when user changes
    setChartData([])
    setUserData(null)
    setLoading(true)

    async function fetchData() {
      try {
        setLoading(true)
        // Pass the userId to getData if available
        const data = await getData(userId)

        console.log("Fetched data for user:", userId, data)

        // Ensure data matches the expected type before setting
        setUserData({
          username: data.username || null,
          income: data.income || 0,
          goal: data.goal,
          saved: data.saved,
          goal_date: data.goal_date,
          business: data.business,
          error: data.error,
        })

        // Process the income value to ensure it's a number
        let incomeValue = 0

        if (data.income) {
          // Log the raw income value for debugging
          console.log("Raw income value:", data.income, typeof data.income)

          // Handle different formats of income data
          if (typeof data.income === "number") {
            incomeValue = data.income
          } else {
            // Extract just the numeric part from the string
            // This regex finds all digits and decimal points in the string
            const matches = data.income.toString().match(/\d+(\.\d+)?/g)
            if (matches && matches.length > 0) {
              incomeValue = Number.parseFloat(matches[0])
              // If there are more matches (like in "£600.00"), join them
              if (matches.length > 1) {
                incomeValue = Number.parseFloat(matches.join(""))
              }
            }
          }

          // Log the parsed value for debugging
          console.log("Parsed income value:", incomeValue)
        }

        // Create monthly data with the income value
        const generatedData: ChartDataItem[] = [
          { month: "January", Income: incomeValue },
          { month: "February", Income: incomeValue },
          { month: "March", Income: incomeValue },
          { month: "April", Income: incomeValue },
          { month: "May", Income: incomeValue },
          { month: "June", Income: incomeValue },
          { month: "July", Income: incomeValue },
          { month: "August", Income: incomeValue },
          { month: "September", Income: incomeValue },
          { month: "October", Income: incomeValue },
          { month: "November", Income: incomeValue },
          { month: "December", Income: incomeValue },
        ]

        setChartData(generatedData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId]) // Add userId as a dependency so the effect runs when it changes

  const chartConfig = {
    Income: {
      label: "Income",
      color: "#0b8c25",
    },
  } satisfies ChartConfig

  if (loading) {
    return <div>Loading income data...</div>
  }

  return (
    <div>
      {userData?.username ? (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Income for {userData.username}</h2>
          <p>Monthly Income: {userData.income}</p>
        </div>
      ) : (
        <div className="mb-4">No user data available</div>
      )}

      <ChartContainer config={chartConfig} className="min-h-[300px] min-w-[600px]">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={20}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `£${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="Income" fill="var(--color-Income)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

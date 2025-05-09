"use client"
// Code is commented to help learn what aspects fixed certain errors and learn them fluently
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { getData } from "@/actions/getData"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type ChartDataItem = {
  month: string
  Income: number
}

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
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(userId)

  useEffect(() => {
    // Used to check if a user has been changed (fixed the error of changing account and the same data being displayed)
    if (userId !== currentUserId) {
      console.log("User changed from", currentUserId, "to", userId)
      // This bit resets the data and changes the userId to the new one
      setChartData([])
      setUserData(null)
      setLoading(true)
      setCurrentUserId(userId)
    }

    async function fetchData() {
      try {
        setLoading(true)

        // Clears all data to make sure no previous users data is stored instead (issue I had previously)
        setUserData(null)
        setChartData([])

        const data = await getData(userId)

        console.log("Fetched data for user:", userId, data)

        // Makes sure data has been given and if data is not null an alternative is provided hence the ||
        setUserData({
          username: data.username || null,
          income: data.income || 0,
          goal: data.goal,
          saved: data.saved,
          goal_date: data.goal_date,
          business: data.business,
          error: data.error,
        })

        let incomeValue = 0

        if (typeof data.income === "string" && data.income.match(/^£\d{1,3}(,\d{3})*\.\d{2}$/)) {
          const cleanValue = data.income.replace(/[£,]/g, "")
          incomeValue = Number.parseFloat(cleanValue)
          console.log("Matched screenshot format, parsed value:", incomeValue)
        }

        if (data.income) {
          // Data is logged to help with debugging (needed as the value came back as 0 a few times)
          // This was used to help isolate the issue
          console.log("Raw income value:", data.income, typeof data.income)

          if (typeof data.income === "number") {
            incomeValue = data.income
            console.log("Using numeric income value:", incomeValue)
          } else {
            // Used to remove pound symbols, commas, and remove all white space so it is able to be stored in the chart
            const cleanedStr = data.income.toString().replace(/£/g, "").replace(/,/g, "").replace(/\s+/g, "").trim()

            console.log("Cleaned income string:", cleanedStr)

            // Try to parse the cleaned string to a float
            const parsedValue = Number.parseFloat(cleanedStr)

            if (!isNaN(parsedValue)) {
              incomeValue = parsedValue
              console.log("Successfully parsed income value:", incomeValue)
            } else {
              const numericValue = cleanedStr.match(/\d+(\.\d+)?/)
              if (numericValue && numericValue[0]) {
                incomeValue = Number.parseFloat(numericValue[0])
                console.log("Extracted numeric value:", incomeValue)
              } else {
                console.error("Failed to parse income value from:", cleanedStr)
                incomeValue = 0
                console.log("Using default income value:", incomeValue)
              }
            }
          }
        }

        // I have slightly multiplied this as monthly income may vary, also a barchart with all the values the same looked rather wrong and pointless
        // The only reason this wouldnt be nessasary is if a user was salaried and they got an exact amount each month
        const baseIncome = incomeValue
        const generatedData: ChartDataItem[] = [
          { month: "January", Income: baseIncome * (1.1)},
          { month: "February", Income: baseIncome * (1.2) },
          { month: "March", Income: baseIncome * (0.9) },
          { month: "April", Income: baseIncome * (1) },
          { month: "May", Income: baseIncome * (0.95) },
          { month: "June", Income: baseIncome * (1.05) },
          { month: "July", Income: baseIncome * (1.1) },
          { month: "August", Income: baseIncome * (0.9) },
          { month: "September", Income: baseIncome * (1) },
          { month: "October", Income: baseIncome * (1.05) },
          { month: "November", Income: baseIncome * (1.1) },
          { month: "December", Income: baseIncome * (1.15) },
        ].map((item) => ({
          ...item,
          Income: Math.round(item.Income * 100) / 100, // Used to rount to 2dp (shouldnt be needed as accounts were created with only 2dp)
          // However if a user has signed up they may use 3dp for some reason hence why this is here
        }))

        setChartData(generatedData)
      } catch (error) {
        // Used to catch if any errors happen and if they do and the above cannot be run then this is ran instead
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchData()
    } else {
      // If theres not a userId then all data is reset to empty
      setUserData(null)
      setChartData([])
      setLoading(false)
    }
  }, [userId])

  const chartConfig = {
    Income: {
      label: "Income",
      color: "hsl(142, 76%, 36%)",
    },
  } satisfies ChartConfig

  // Displays an animation if the chart hasnt loaded quick enough
  if (loading) {
    return <div className="p-4 text-center">Loading income data for {userId || "user"}...</div>
  }

  return (
    //the below displays each piece of data pulled from the database details and displays it in box's to be displayed sharply
    <div>
      {userData?.username ? (
        <div className="mb-6 p-4 bg-card rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-background rounded-md border">
              <p className="text-sm text-muted-foreground">Average Monthly Income</p>
              <p className="text-xl font-semibold">
                {typeof userData.income === "number"
                  ? `£${userData.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : userData.income}
              </p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="text-sm text-muted-foreground">Goal</p>
              <p className="text-xl font-semibold">
                {typeof userData.goal === "number"
                  ? `£${userData.goal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : userData.goal}
              </p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="text-sm text-muted-foreground">Saved</p>
              <p className="text-xl font-semibold">
                {typeof userData.saved === "number"
                  ? `£${userData.saved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : userData.saved}
              </p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="text-sm text-muted-foreground">Goal Date</p>
              <p className="text-xl font-semibold">{userData.goal_date}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-card rounded-lg shadow-sm text-center">No user data available</div>
      )}

      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[400px] w-[600px]">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `£${value.toLocaleString()}`}
              domain={[0, "dataMax * 1.1"]} // Add 10% padding to the top
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `£${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  }
                />
              }
            />
            <Bar dataKey="Income" fill="var(--color-Income)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="p-4 text-center">No chart data available</div>
      )}
    </div>
  )
}

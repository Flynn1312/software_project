"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", Income: 186},
  { month: "February", Income: 305},
  { month: "March", Income: 237},
  { month: "April", Income: 73},
  { month: "May", Income: 209},
  { month: "June", Income: 214},
  { month: "July", Income: 186},
  { month: "August", Income: 305},
  { month: "September", Income: 237},
  { month: "October", Income: 73},
  { month: "November", Income: 209},
  { month: "December", Income: 214},
]

const chartConfig = {
  Income: {
    label: "Income",
    color: "#0b8c25",
  },
  
} satisfies ChartConfig


export function Income() {
  return (
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="Income" fill="var(--color-Income)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
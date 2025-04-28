"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { money: "Saved", amount: 275, fill: "var(--color-Saved)" },
  { money: "Left to save", amount: 200, fill: "var(--color-Left)" },
]

const chartConfig = {
  Saved: {
    label: "Saved",
    color: "#0b8c25",
  },
  Left: {
    label: "Left to save",
    color: "#17b035",
  },
} satisfies ChartConfig

export function Saved() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Saved/Left to save</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] min-w-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="money"
              innerRadius={50}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 
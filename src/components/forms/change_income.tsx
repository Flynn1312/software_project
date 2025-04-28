import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function IncomeForm() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Your Income</CardTitle>
          <CardDescription>Add your income details to track your financial progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="income-type">Income Type</Label>
            <RadioGroup defaultValue="yearly" id="income-type" className="space-y-2">
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
            <Input id="amount" type="number" placeholder="0.00" className="text-base" />
            <p className="text-sm text-muted-foreground">Enter your monthly income amount.</p>
          </div>
        </CardContent>
        <CardFooter>
        <Link href="/" className="w-full">
          <Button className="w-full">Save Income</Button>
        </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

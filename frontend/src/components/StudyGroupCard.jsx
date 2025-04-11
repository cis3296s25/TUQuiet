import * as React from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function StudyGroupCard() {
    return (
        <Card className="max-w-[1500px] min-w-[500px]">
        <CardHeader>
            
        <div className="flex justify-between items-center w-full">
            <CardTitle>Name will go Here</CardTitle>
            <CardTitle>CRN will go here</CardTitle>
        </div>

        <div className="flex justify-between items-center w-full">
          <CardDescription>Major will go here </CardDescription>
          <CardDescription>Time Stamp from when this was posted </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            <CardTitle className="text-xl">Whatever the user wants to name the card</CardTitle>
            <CardDescription className="mt-2 pb-5">User Description can be put here of what their group that they have set up will be doing</CardDescription>

            <div className="flex justify-between items-center w-[30rem]">
                <CardDescription>Date of Session will go here </CardDescription>
                <CardDescription>Time Happening </CardDescription>
            </div>
            <div className="flex justify-between items-center w-[30rem]">
                <CardDescription>Where its taking places </CardDescription>
                <CardDescription>3/5 </CardDescription>
            </div>


         
        </CardContent>
        <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline">👍</Button>
          <Button variant="outline">💬</Button>
        </div>
          <Button>Join Group</Button>
        </CardFooter>
      </Card>
    )
}

export default StudyGroupCard;

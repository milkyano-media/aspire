import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BookUserIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export default function StudentForm() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BookUserIcon />
          <h2>Student 1 Information</h2>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <form className="flex flex-col gap-9">
          {/* Basic Information */}
          <div className="flex gap-3">
            <div className="grow">
              <Label className="font-bold" htmlFor="student1FullName">
                Full Name
              </Label>
              <Input id="student1FullName" placeholder="Full Name" />
            </div>
            <div className="grow">
              <Label className="font-bold" htmlFor="student1Email">
                Email
              </Label>
              <Input type="email" id="student1Email" placeholder="Email" />
            </div>
            <div className="grow">
              <Label className="font-bold" htmlFor="student1PhoneNumber">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="student1PhoneNumber"
                placeholder="Phone Number"
              />
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            {/* Gender Field */}
            <div className="grow">
              <Label className="font-bold" htmlFor="student1Gender">
                Gender
              </Label>
              <RadioGroup className="flex gap-3" id="student1Gender">
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="A" id="student1GenderMale" />
                  <Label htmlFor="student1GenderMale">Male</Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="B" id="student1GenderFemale" />
                  <Label htmlFor="student1GenderFemale">Female</Label>
                </div>
              </RadioGroup>
            </div>

            {/* DoB Field */}
            <div className="grow">
              <Label className="font-bold" htmlFor="student1DateOfBirth">
                Date of Birth
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="grow">
              <Label className="font-bold" htmlFor="student1SchoolGrade">
                School Grade
              </Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent className="w-auto">
                  <SelectItem value="A">Year 3</SelectItem>
                  <SelectItem value="B">Year 4</SelectItem>
                  <SelectItem value="C">Year 5</SelectItem>
                  <SelectItem value="D">Year 6</SelectItem>
                  <SelectItem value="E">Year 7</SelectItem>
                  <SelectItem value="F">Year 8</SelectItem>
                  <SelectItem value="G">Year 9</SelectItem>
                  <SelectItem value="H">Year 10</SelectItem>
                  <SelectItem value="I">Year 11</SelectItem>
                  <SelectItem value="J">Year 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grow">
              <Label className="font-bold" htmlFor="student1VceClassSubject">
                VCE Class Subject
              </Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Requires Year 11 or 12" />
                </SelectTrigger>
                <SelectContent className="w-auto">
                  <SelectItem value="VCE Math Methods Unit 1 & 2">
                    VCE Math Methods Unit 1 & 2
                  </SelectItem>
                  <SelectItem value="VCE Math Methods Unit 3 & 4">
                    VCE Math Methods Unit 3 & 4
                  </SelectItem>
                  <SelectItem value="VCE Chemistry Unit 1 & 2">
                    VCE Chemistry Unit 1 & 2
                  </SelectItem>
                  <SelectItem value="VCE Chemistry Unit 3 & 4">
                    VCE Chemistry Unit 3 & 4
                  </SelectItem>
                  <SelectItem value="VCE Biology Unit 3 & 4">
                    VCE Biology Unit 3 & 4
                  </SelectItem>
                  <SelectItem value="VCE General Math Unit 3 & 4">
                    VCE General Math Unit 3 & 4
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { useState } from "react";

export default function StudentForm() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  const isVCEEnabled = selectedGrade === "I" || selectedGrade === "J";

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
      <CardHeader className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <UserIcon className="text-blue-600" />
          Student 1 Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        <form className="space-y-6">
          {/* Top Row: Name, Email, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="student1FullName"
              >
                Student Name
              </Label>
              <Input
                id="student1FullName"
                placeholder="Full Name"
                className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold" htmlFor="student1Email">
                Student Email
              </Label>
              <Input
                type="email"
                id="student1Email"
                placeholder="Email Address"
                className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="student1PhoneNumber"
              >
                Student Phone
              </Label>
              <Input
                type="tel"
                id="student1PhoneNumber"
                placeholder="Phone Number"
                className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <Separator className="border-gray-100" />

          {/* Middle Row: Gender & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender Radio Group */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold">Gender</Label>
              <RadioGroup className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="male" id="student1GenderMale" />
                  <Label
                    htmlFor="student1GenderMale"
                    className="cursor-pointer"
                  >
                    Male
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="female" id="student1GenderFemale" />
                  <Label
                    htmlFor="student1GenderFemale"
                    className="cursor-pointer"
                  >
                    Female
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="student1GenderOther" />
                  <Label
                    htmlFor="student1GenderOther"
                    className="cursor-pointer"
                  >
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="student1DateOfBirth"
              >
                Date of Birth
              </Label>
              <Input
                type="date"
                id="student1DateOfBirth"
                className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Bottom Row: Grade & Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* School Grade */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="student1SchoolGrade"
              >
                School Grade
              </Label>
              <Select onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-full h-12 rounded-lg">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
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

            {/* VCE Class (Conditionally Disabled) */}
            <div
              className={`flex flex-col gap-2 ${!isVCEEnabled ? "opacity-50" : ""}`}
            >
              <Label
                className="text-sm font-semibold"
                htmlFor="student1VceClassSubject"
              >
                VCE Class Subject
              </Label>
              <Select disabled={!isVCEEnabled}>
                <SelectTrigger className="w-full h-12 rounded-lg">
                  <SelectValue
                    placeholder={
                      isVCEEnabled
                        ? "Select VCE Subject"
                        : "Requires Year 11 or 12"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
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

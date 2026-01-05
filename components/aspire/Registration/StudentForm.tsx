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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  UserIcon,
  Trash2Icon,
  SchoolIcon,
  FileTextIcon,
  MonitorIcon,
  ChevronDownIcon,
} from "lucide-react";

interface StudentData {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  schoolGrade: string;
  vceClass: string[];
  schoolName: string;
  additionalDetails: string;
  preference: string;
}

interface StudentFormProps {
  studentNumber: number;
  data: StudentData;
  onChange: (data: Partial<StudentData>) => void;
  onRemove: () => void;
  showRemove: boolean;
}

const formatAustralianPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters except +
  let cleaned = value.replace(/[^\d+]/g, "");

  // If empty, return empty
  if (!cleaned) return "";

  // If starts with 0, replace with +61
  if (cleaned.startsWith("0")) {
    cleaned = "+61" + cleaned.slice(1);
  }
  // If doesn't start with +61, add it
  else if (!cleaned.startsWith("+61")) {
    // If starts with 61 but no +, add the +
    if (cleaned.startsWith("61")) {
      cleaned = "+" + cleaned;
    }
    // Otherwise prepend +61
    else if (!cleaned.startsWith("+")) {
      cleaned = "+61" + cleaned;
    }
  }

  return cleaned;
};

export default function StudentForm({
  studentNumber,
  data,
  onChange,
  onRemove,
  showRemove,
}: StudentFormProps) {
  const isVCEEnabled = data.schoolGrade === "I" || data.schoolGrade === "J";

  const handlePhoneChange = (value: string) => {
    const formatted = formatAustralianPhoneNumber(value);
    onChange({ phoneNumber: formatted });
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
      <CardHeader className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <UserIcon className="text-blue-600" />
          Student {studentNumber} Information
        </CardTitle>
        {showRemove && (
          <Button
            onClick={onRemove}
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <Trash2Icon className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        <form className="space-y-6">
          {/* Top Row: Name, Email, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}FullName`}
              >
                Student Name
              </Label>
              <Input
                id={`student${studentNumber}FullName`}
                placeholder="Full Name"
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}Email`}
              >
                Student Email
              </Label>
              <Input
                type="email"
                id={`student${studentNumber}Email`}
                placeholder="Email Address"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}PhoneNumber`}
              >
                Student Phone <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                type="tel"
                id={`student${studentNumber}PhoneNumber`}
                placeholder="e.g. +61 412 345 678"
                value={data.phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
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
              <RadioGroup
                className="flex gap-4"
                value={data.gender}
                onValueChange={(value) => onChange({ gender: value })}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="A"
                    id={`student${studentNumber}GenderMale`}
                  />
                  <Label
                    htmlFor={`student${studentNumber}GenderMale`}
                    className="cursor-pointer"
                  >
                    Male
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="B"
                    id={`student${studentNumber}GenderFemale`}
                  />
                  <Label
                    htmlFor={`student${studentNumber}GenderFemale`}
                    className="cursor-pointer"
                  >
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}DateOfBirth`}
              >
                Date of Birth
              </Label>
              <Input
                type="date"
                id={`student${studentNumber}DateOfBirth`}
                value={data.dateOfBirth}
                onChange={(e) => onChange({ dateOfBirth: e.target.value })}
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
                htmlFor={`student${studentNumber}SchoolGrade`}
              >
                School Grade
              </Label>
              <Select
                value={data.schoolGrade}
                onValueChange={(value) => {
                  // Reset VCE class if grade is not Year 11 or 12
                  if (value !== "I" && value !== "J") {
                    onChange({ schoolGrade: value, vceClass: [] });
                  } else {
                    onChange({ schoolGrade: value });
                  }
                }}
              >
                <SelectTrigger
                  className="w-full !h-12 !px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  id={`student${studentNumber}SchoolGrade`}
                >
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Year 3</SelectItem>
                  <SelectItem value="B">Year 4</SelectItem>
                  <SelectItem value="C">Year 5</SelectItem>
                  <SelectItem value="D">Year 6</SelectItem>
                  <SelectItem value="E">Year 7</SelectItem>
                  <SelectItem value="F">Year 8</SelectItem>
                  <SelectItem value="K">Selective Entry</SelectItem>
                  <SelectItem value="G">Year 9</SelectItem>
                  <SelectItem value="H">Year 10</SelectItem>
                  <SelectItem value="I">Year 11</SelectItem>
                  <SelectItem value="J">Year 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VCE Class (Conditionally Disabled) - Multi-Select */}
            <div
              className={`flex flex-col gap-2 ${!isVCEEnabled ? "opacity-50" : ""}`}
            >
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}VceClassSubject`}
              >
                VCE Class Subject (Multi-select)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!isVCEEnabled}
                    className="w-full !h-12 !px-4 !py-0 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all justify-between text-left font-normal"
                    id={`student${studentNumber}VceClassSubject`}
                  >
                    <span className="truncate">
                      {isVCEEnabled
                        ? data.vceClass.length > 0
                          ? data.vceClass.join(", ")
                          : "Select VCE Subjects"
                        : "Requires Year 11 or 12"}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-4" align="start">
                  <div className="space-y-3">
                    {[
                      "VCE Math Methods Unit 1 & 2",
                      "VCE Math Methods Unit 3 & 4",
                      "VCE Chemistry Unit 1 & 2",
                      "VCE Chemistry Unit 3 & 4",
                      "VCE Biology unit 1 & 2",
                      "VCE Biology Unit 3 & 4",
                      "VCE Specialist Maths Unit 1 & 2",
                      "VCE Specialist Maths Unit 3 & 4",
                      "VCE General Math Unit 3 & 4",
                      "VCE Psychology Unit 3 & 4",
                      "VCE Health & Human Development unit 3 & 4",
                    ].map((subject) => (
                      <div key={subject} className="flex items-center gap-2">
                        <Checkbox
                          id={`${studentNumber}-${subject}`}
                          checked={data.vceClass.includes(subject)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onChange({
                                vceClass: [...data.vceClass, subject],
                              });
                            } else {
                              onChange({
                                vceClass: data.vceClass.filter(
                                  (item) => item !== subject,
                                ),
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor={`${studentNumber}-${subject}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator className="border-gray-100" />

          {/* School & Preference Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Name */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}SchoolName`}
              >
                School Name
              </Label>
              <div className="relative">
                <SchoolIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id={`student${studentNumber}SchoolName`}
                  placeholder="e.g. Melbourne High School"
                  value={data.schoolName}
                  onChange={(e) => onChange({ schoolName: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Learning Preference */}
            <div className="flex flex-col gap-2">
              <Label
                className="text-sm font-semibold"
                htmlFor={`student${studentNumber}Preference`}
              >
                Learning Preference
              </Label>
              <div className="relative">
                <MonitorIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
                <Select
                  value={data.preference}
                  onValueChange={(value) => onChange({ preference: value })}
                >
                  <SelectTrigger
                    className="w-full !h-12 !pl-12 !pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    id={`student${studentNumber}Preference`}
                  >
                    <SelectValue placeholder="Select Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Online</SelectItem>
                    <SelectItem value="B">In-Person (Offline)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Details - Full Width */}
          <div className="flex flex-col gap-2">
            <Label
              className="text-sm font-semibold"
              htmlFor={`student${studentNumber}AdditionalDetails`}
            >
              Additional Details{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </Label>
            <div className="relative">
              <FileTextIcon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <Textarea
                id={`student${studentNumber}AdditionalDetails`}
                placeholder="Any additional information about learning needs, goals, or preferences..."
                value={data.additionalDetails}
                onChange={(e) =>
                  onChange({ additionalDetails: e.target.value })
                }
                rows={3}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all resize-none"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

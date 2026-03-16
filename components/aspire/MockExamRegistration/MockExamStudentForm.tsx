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
import { UserIcon } from "lucide-react";

interface StudentData {
  name: string;
  email: string;
  gender: string;
  yearLevel: string;
}

interface MockExamStudentFormProps {
  data: StudentData;
  onChange: (data: Partial<StudentData>) => void;
}

export default function MockExamStudentForm({
  data,
  onChange,
}: MockExamStudentFormProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <UserIcon className="text-blue-600" />
          Student Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label>Student Name</Label>
          <Input
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label>Student Email</Label>
          <Input
            type="email"
            placeholder="Email Address"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-3">
          <Label>Gender</Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(value) => onChange({ gender: value })}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="A" id="genderMale" />
              <Label htmlFor="genderMale">Male</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="B" id="genderFemale" />
              <Label htmlFor="genderFemale">Female</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Year Level */}
        <div className="flex flex-col gap-2">
          <Label>Current Year Level</Label>

          <Select
            value={data.yearLevel}
            onValueChange={(value) => onChange({ yearLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year Level" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="6">Year 6</SelectItem>
              <SelectItem value="7">Year 7</SelectItem>
              <SelectItem value="8">Year 8</SelectItem>
              <SelectItem value="9">Year 9</SelectItem>
              <SelectItem value="10">Year 10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  IdCardIcon,
  MailIcon,
  PhoneIcon,
  UserRoundIcon,
  UsersIcon,
  HomeIcon,
} from "lucide-react";

interface ParentData {
  name: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  address: string;
}

interface ParentFormProps {
  data: ParentData;
  onChange: (data: Partial<ParentData>) => void;
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

export default function ParentForm({ data, onChange }: ParentFormProps) {
  const handlePhoneChange = (value: string) => {
    const formatted = formatAustralianPhoneNumber(value);
    onChange({ phoneNumber: formatted });
  };
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <UserRoundIcon className="text-blue-600" />
          Parent Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name - Full Width */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label className="text-sm font-semibold" htmlFor="parentFullName">
              Full Name
            </Label>
            <div className="relative">
              <IdCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="parentFullName"
                placeholder="e.g. Jane Doe"
                required
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full h-12 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold" htmlFor="parentEmail">
              Email Address
            </Label>
            <div className="relative">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                id="parentEmail"
                placeholder="e.g. jane@example.com"
                required
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="w-full h-12 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label
              className="text-sm font-semibold"
              htmlFor="parentPhoneNumber"
            >
              Phone Number
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="tel"
                id="parentPhoneNumber"
                placeholder="e.g. +61 412 345 678"
                required
                value={data.phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Relationship */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label
              className="text-sm font-semibold"
              htmlFor="parentRelationship"
            >
              Relationship to Student
            </Label>
            <div className="relative">
              <UsersIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
              <Select
                value={data.relationship}
                onValueChange={(value) => onChange({ relationship: value })}
              >
                <SelectTrigger
                  className="w-full h-12 pl-12 pr-4 rounded-lg"
                  id="parentRelationship"
                >
                  <SelectValue placeholder="Select Relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Father</SelectItem>
                  <SelectItem value="B">Mother</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label className="text-sm font-semibold" htmlFor="parentAddress">
              Address
            </Label>
            <div className="relative">
              <HomeIcon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <Textarea
                id="parentAddress"
                placeholder="e.g. 123 Main Street, Truganina VIC 3029"
                required
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
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

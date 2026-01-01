import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeIcon, MailIcon, PhoneIcon, UserRoundIcon } from "lucide-react";

export default function ParentForm() {
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
              <BadgeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="parentFullName"
                placeholder="e.g. Jane Doe"
                required
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
                className="w-full h-12 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold" htmlFor="parentPhoneNumber">
              Phone Number
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="tel"
                id="parentPhoneNumber"
                placeholder="e.g. (555) 123-4567"
                required
                className="w-full h-12 pl-12 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

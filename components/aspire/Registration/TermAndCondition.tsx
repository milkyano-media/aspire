import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileTextIcon } from "lucide-react";

interface TermAndConditionProps {
  acceptedTerms: boolean;
  onChecked: (checked: boolean) => void;
}

export default function TermAndCondition({
  acceptedTerms,
  onChecked,
}: TermAndConditionProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <FileTextIcon className="text-blue-600 h-5 w-5" />
          Terms & Conditions, Payment Policy & Privacy Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm leading-relaxed space-y-4">
          <div>
            <h3 className="font-bold text-base mb-2">Aspire Academics</h3>
            <h4 className="font-semibold mb-1">
              Terms & Conditions, Payment Policy & Privacy Policy
            </h4>
            <p className="text-gray-600 text-xs mb-3">
              Last updated: 1 January 2026
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">1. About Aspire Academics</h4>
            <p className="text-gray-700">
              Aspire Academics provides academic tutoring services for students
              from Year 3 to Year 12, including English, Mathematics, Selective
              Entry & Scholarship preparation, and VCE subjects.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">2. LMS Access & Onboarding</h4>
            <p className="text-gray-700">
              Access to the Aspire Academics Learning Management System (LMS) is
              granted only after successful enrolment and payment. LMS access
              may be restricted or suspended if payment obligations are not met.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">3. Packages & Services</h4>
            <p className="text-gray-700">
              Aspire Academics offers Standard and Premium packages. Premium
              packages include additional resources and eligibility to book one
              one-on-one consultation per week. Package benefits are
              non-transferable.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">4. Payment Policy</h4>
            <p className="text-gray-700">
              All fees are payable termly and in advance. Payment must be made
              in full before the commencement of each term to confirm enrolment
              and maintain LMS access.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">5. Payment Methods</h4>
            <p className="text-gray-700">
              Payments may be made online through the LMS via Stripe, by credit
              or debit card, or via EFTPOS at the Aspire Academics centre.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">
              6. Attendance, Missed Classes & Credit Policy
            </h4>
            <p className="text-gray-700">
              Aspire Academics does not offer refunds. If a student misses up to
              two classes in a term, those classes will be credited to the
              following term. If three or more classes are missed, only two will
              be credited.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">
              7. One-on-One Consultations (Premium Package)
            </h4>
            <p className="text-gray-700">
              Premium students are entitled to one one-on-one consultation per
              week. Unused consultations expire weekly and do not carry over.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">8. Notice Period</h4>
            <p className="text-gray-700">
              A minimum of one week's notice prior to the end of term is
              required if a student will not continue into the following term.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">9. Behaviour & Communication</h4>
            <p className="text-gray-700">
              All LMS communication must remain respectful and appropriate.
              Aspire Academics reserves the right to restrict access if misuse
              occurs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">10. Privacy Policy</h4>
            <p className="text-gray-700">
              Personal information is collected solely to deliver services and
              operate the LMS. Aspire Academics does not sell or distribute
              personal data.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">11. Technology Disclaimer</h4>
            <p className="text-gray-700">
              Aspire Academics is not liable for temporary LMS outages,
              maintenance, or third-party system issues.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-1">12. Acceptance</h4>
            <p className="text-gray-700">
              By enrolling, accessing the LMS, or selecting 'I Agree', you
              confirm acceptance of these Terms & Conditions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={onChecked}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I agree to the Terms & Conditions, Payment Policy and Privacy Policy
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

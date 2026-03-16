import { sendGradePricingEmail } from "@/lib/email/service";

const wiseBaseUrl = process.env.WISELMS_API_HOST;
const wiseInstituteId = process.env.WISELMS_INSTITUTE_ID;
const wiseAuthentication = process.env.WISE_AUTHENTICATION;
const wiseApiKey = process.env.WISELMS_API_KEY;
const wiseNamespace = process.env.WISELMS_NAMESPACE;
const wiseUserAgent = process.env.WISELMS_USER_AGENT;

export async function POST(request: Request) {

  try {

    const student = await request.json();

    const vendorUserId = crypto.randomUUID();

    const createStudentBody = {
      vendorUserId,
      name: student.name,
      email: student.email,
      profile: "student",
    };

    const createStudentResponse = await fetch(
      `https://${wiseBaseUrl}/vendors/institutes/${wiseInstituteId}/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": wiseApiKey!,
          "x-wise-namespace": wiseNamespace!,
          "Content-Type": "application/json",
          "User-Agent": wiseUserAgent!,
        },
        body: JSON.stringify(createStudentBody),
      },
    );

    const createStudentJson = await createStudentResponse.json();

    if (!createStudentResponse.ok) {
      throw new Error(createStudentJson.message || "Failed to create student");
    }

    const studentId = createStudentJson.data.user._id;

    /**
     * Update registration fields
     */

    const registrationBody = {
      answers: [
        {
          questionId: "user_name",
          answer: student.name,
        },
        {
          questionId: "user_email",
          answer: student.email,
        },
        {
          questionId: "mock_exam_gender",
          answer: student.gender,
        },
        {
          questionId: "mock_exam_year_level",
          answer: student.yearLevel,
        },
      ],
    };

    const updateRegistration = await fetch(
      `https://${wiseBaseUrl}/institutes/${wiseInstituteId}/students/${studentId}/registration`,
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": wiseApiKey!,
          "x-wise-namespace": wiseNamespace!,
          "Content-Type": "application/json",
          "User-Agent": wiseUserAgent!,
        },
        body: JSON.stringify(registrationBody),
      },
    );

    if (!updateRegistration.ok) {
      throw new Error("Failed to update student registration");
    }

    /**
     * Optional email notification
     */

    try {

      await sendGradePricingEmail(
        student.email,
        student.name,
        student.name,
        student.yearLevel
      );

    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return Response.json(
      { message: "Mock exam registration success" },
      { status: 200 }
    );

  } catch (err) {

    console.error("Mock exam error:", err);

    return Response.json(
      { message: (err as Error).message },
      { status: 500 }
    );

  }

}
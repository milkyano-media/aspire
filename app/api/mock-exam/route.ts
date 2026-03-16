import { sendGradePricingEmail } from "@/lib/email/service";

const wiseBaseUrl = process.env.WISELMS_API_HOST;
const wiseInstituteId = process.env.WISELMS_INSTITUTE_ID;
const wiseAuthentication = process.env.WISE_AUTHENTICATION;
const wiseApiKey = process.env.WISELMS_API_KEY;
const wiseNamespace = process.env.WISELMS_NAMESPACE;
const wiseUserAgent = process.env.WISELMS_USER_AGENT;

export async function POST(request: Request) {
  try {
    const vendorUserId = crypto.randomUUID();
    const reqBody = await request.json();
    const { student, parent } = reqBody;

    /* CREATE STUDENT */

    const createStudentResponseBody = {
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
          "x-api-key": `${wiseApiKey}`,
          "x-wise-namespace": `${wiseNamespace}`,
          "Content-Type": "application/json",
          "User-Agent": `${wiseUserAgent}`,
        },
        body: JSON.stringify(createStudentResponseBody),
      }
    );

    const createStudentJson = await createStudentResponse.json();

    if (!createStudentResponse.ok) {
      const errorMessage =
        createStudentJson.message || "Unable to create student account";

      throw new Error(
        `Registration failed: ${errorMessage}. Please check your details and try again`
      );
    }

    const studentId = createStudentJson.data.user._id;

    /* UPDATE REGISTRATION FIELD */

    const updateStudentRegistrationFieldBody = {
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
          questionId: "a5iicjzo",
          answer: student.gender,
        },
        {
          questionId: "xah2ac4z", 
          answer: student.yearLevel,
        },
        {
          questionId: "z3xugv7s",
          answer: parent.name,
        },
        {
          questionId: "khfnust3",
          answer: parent.email,
        },
        {
          questionId: "auhyhiuy",
          answer: parent.phoneNumber,
        },
        {
          questionId: "6p1zmkvj",
          answer: parent.address,
        },
        {
          questionId: "srxs890l",
          answer: parent.relationship,
        },
      ],
    };

    const updateStudentResponse = await fetch(
      `https://${wiseBaseUrl}/institutes/${wiseInstituteId}/students/${studentId}/registration`,
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": `${wiseApiKey}`,
          "x-wise-namespace": `${wiseNamespace}`,
          "Content-Type": "application/json",
          "User-Agent": `${wiseUserAgent}`,
        },
        body: JSON.stringify(updateStudentRegistrationFieldBody),
      }
    );

    if (!updateStudentResponse.ok) {
      const updateErrorJson = await updateStudentResponse.json();

      const errorMessage =
        updateErrorJson.message || "Unable to save student information";

      throw new Error(
        `Failed to complete registration: ${errorMessage}. Please contact support`
      );
    }

    /* SEND EMAIL */

    try {
      await sendGradePricingEmail(
        parent.email,
        parent.name,
        student.name,
        student.yearLevel
      );
    } catch (err) {
      console.error("Email send failed", err);
    }

    return Response.json(
      { message: "success" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Mock exam registration error:", err);

    const errorMessage =
      (err as Error).message ||
      "An unexpected error occurred during registration";

    return Response.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
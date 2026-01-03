import { sendRegistrationConfirmationEmail } from '@/lib/email/service';

export async function POST(request: Request) {
  try {
    const wiseBaseUrl = process.env.WISELMS_API_HOST;
    const wiseInstituteId = process.env.WISELMS_INSTITUTE_ID;
    const wiseAuthentication = process.env.WISE_AUTHENTICATION;
    const wiseApiKey = process.env.WISELMS_API_KEY;
    const wiseNamespace = process.env.WISELMS_NAMESPACE;
    const wiseUserAgent = process.env.WISELMS_USER_AGENT;
    const vendorUserId = crypto.randomUUID();
    const reqBody = await request.json();
    const { student, parent } = reqBody;

    const createStudentResponseBody = {
      vendorUserId,
      name: student.name,
      email: student.email,
      phoneNumber: student.phoneNumber,
      profile: "student",
    };
    console.log(
      `createStudentResponseBody: ${JSON.stringify(createStudentResponseBody)}`,
    );
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
      },
    );
    const createStudentJson = await createStudentResponse.json();
    if (createStudentResponse.status !== 200) {
      throw new Error(createStudentJson.message);
    }
    const studentId = createStudentJson.data.user._id;

    // Update Student Registration Fields
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
          questionId: "user_phone_number",
          answer: student.phoneNumber,
        },
        {
          questionId: "a5iicjzo",
          answer: student.gender,
        },
        {
          questionId: "063oa4tl",
          answer: student.dateOfBirth,
        },
        {
          questionId: "awkv8xxa",
          answer: student.schoolGrade,
        },
        {
          questionId: "qb1epgwc",
          answer:
            student.vceClass.trim().length !== 0 ? student.vceClass : "None",
        },
        {
          questionId: "08hn1i9g",
          answer: student.schoolName,
        },
        {
          questionId: "3r7joiav",
          answer: student.additionalDetails,
        },
        {
          questionId: "8ykravcf",
          answer: student.preference,
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
    console.log(
      `updateStudentRegistrationFieldBody: ${JSON.stringify(updateStudentRegistrationFieldBody)}`,
    );
    const updateStudentRegistrationField = await fetch(
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
      },
    );
    const updateStudentRegistrationFieldJson =
      await updateStudentRegistrationField.json();
    if (updateStudentRegistrationField.status !== 200) {
      throw new Error(updateStudentRegistrationFieldJson.message);
    }

    // Send confirmation email to parent (non-blocking - silent failure)
    try {
      const emailResult = await sendRegistrationConfirmationEmail({
        parent: {
          name: parent.name,
          email: parent.email,
          phoneNumber: parent.phoneNumber,
          relationship: parent.relationship,
          address: parent.address,
        },
        student: {
          name: student.name,
          email: student.email,
          phoneNumber: student.phoneNumber,
          gender: student.gender,
          dateOfBirth: student.dateOfBirth,
          schoolGrade: student.schoolGrade,
          vceClass: student.vceClass,
          schoolName: student.schoolName,
          additionalDetails: student.additionalDetails,
          preference: student.preference,
        },
      });

      if (!emailResult.success) {
        console.error('Failed to send registration confirmation email:', emailResult.error);
        // Continue - don't fail registration if email fails
      }
    } catch (emailError) {
      console.error('Unexpected error sending registration confirmation email:', emailError);
      // Continue - don't fail registration if email fails
    }

    return Response.json(
      {
        message: "success",
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    return Response.json(
      {
        message: (err as Error).message,
      },
      {
        status: 500,
      },
    );
  }
}

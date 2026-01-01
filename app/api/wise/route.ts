export async function POST(request: Request) {
  try {
    const wiseBaseUrl = process.env.WISE_BASE_URL;
    const wiseInstituteId = process.env.WISE_INSTITUTE_ID;
    const wiseAuthentication = process.env.WISE_AUTHENTICATION;
    const wiseApiKey = process.env.WISE_API_KEY;
    const wiseNamespace = process.env.WISE_NAMESPACE;
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
      `${wiseBaseUrl}/vendors/institutes/${wiseInstituteId}/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": `${wiseApiKey}`,
          "x-wise-namespace": `${wiseNamespace}`,
          "Content-Type": "application/json",
          "User-Agent": "VendorIntegrations/aspireacademics",
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
      ],
    };
    console.log(
      `updateStudentRegistrationFieldBody: ${JSON.stringify(updateStudentRegistrationFieldBody)}`,
    );
    const updateStudentRegistrationField = await fetch(
      `${wiseBaseUrl}/institutes/${wiseInstituteId}/students/${studentId}/registration`,
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": `${wiseApiKey}`,
          "x-wise-namespace": `${wiseNamespace}`,
          "Content-Type": "application/json",
          "User-Agent": "VendorIntegrations/aspireacademics",
        },
        body: JSON.stringify(updateStudentRegistrationFieldBody),
      },
    );
    const updateStudentRegistrationFieldJson =
      await updateStudentRegistrationField.json();
    if (updateStudentRegistrationField.status !== 200) {
      throw new Error(updateStudentRegistrationFieldJson.message);
    }

    return Response.json(null, {
      status: 204,
    });
  } catch (err) {
    return Response.json({
      message: "",
    });
  }
}

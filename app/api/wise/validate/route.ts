const wiseBaseUrl = process.env.WISELMS_API_HOST;
const wiseInstituteId = process.env.WISELMS_INSTITUTE_ID;
const wiseAuthentication = process.env.WISE_AUTHENTICATION;
const wiseApiKey = process.env.WISELMS_API_KEY;
const wiseNamespace = process.env.WISELMS_NAMESPACE;
const wiseUserAgent = process.env.WISELMS_USER_AGENT;

interface Student {
  joinedOn: string;
  classrooms: [];
  _id: string;
  name: string;
  profilePicture: string;
  email: string;
  phoneNumber: string;
  uuid: string;
  activated: string;
  linkedDeviceCount: number;
  parents: [];
}

interface GetAllStudents {
  students: Student[];
  count: number;
}

interface GetAllStudentResponse {
  status: number;
  message: string;
  data: GetAllStudents;
}

interface RegistrationDataField {
  questionText: string;
  questionId: string;
  required: boolean;
  type: string;
  answer: string;
}

interface RegistrationData {
  fields: RegistrationDataField[];
}

interface StudentReport {
  registrationData: RegistrationData;
}

interface StudentRegistrationData {
  studentReport: StudentReport;
}

interface StudentRegistrationDataResponse {
  status: number;
  message: string;
  data: StudentRegistrationData;
}

async function validateByName(
  student: any,
  queryString: URLSearchParams,
): Promise<void> {
  try {
    let newStudentName = queryString.get("searchTerm");
    if (!newStudentName) {
      throw new Error("Student name is required for validation");
    }
    newStudentName = newStudentName.trim().toLowerCase();
    const newStudentSchoolGrade = student.schoolGrade;

    const getAllStudents = await fetch(
      `https://${wiseBaseUrl}/institutes/v3/${wiseInstituteId}/students?${queryString.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": `${wiseApiKey}`,
          "x-wise-namespace": `${wiseNamespace}`,
          "Content-Type": "application/json",
          "User-Agent": `${wiseUserAgent}`,
        },
      },
    );
    if (!getAllStudents.ok) {
      throw new Error(
        "Unable to verify student details. Please try again later or contact support if the issue persists",
      );
    }
    const response: GetAllStudentResponse = await getAllStudents.json();
    if (response.data.count === 0) {
      return;
    }

    for (const student of response.data.students) {
      const sanitizedExistingStudent = student.name.trim().toLowerCase();
      if (sanitizedExistingStudent === newStudentName) {
        const getStudentRegistrationData = await fetch(
          `https://${wiseBaseUrl}/public/institutes/${wiseInstituteId}/studentReports/${student._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${wiseAuthentication}`,
              "x-api-key": `${wiseApiKey}`,
              "x-wise-namespace": `${wiseNamespace}`,
              "Content-Type": "application/json",
              "User-Agent": `${wiseUserAgent}`,
            },
          },
        );
        if (!getStudentRegistrationData.ok) {
          throw new Error(
            "Unable to verify student details. Please try again later or contact support if the issue persists",
          );
        }
        const studentRegistrationDataJson: StudentRegistrationDataResponse =
          await getStudentRegistrationData.json();
        const studentFieldIndex =
          studentRegistrationDataJson.data.studentReport.registrationData.fields.findIndex(
            (element) => element.questionId === "awkv8xxa",
          );
        if (
          studentRegistrationDataJson.data.studentReport.registrationData
            .fields[studentFieldIndex].answer === newStudentSchoolGrade
        ) {
          throw new Error(
            "A student with this name is already registered. If you believe this is an error, please contact us",
          );
        }
      }
    }

    return;
  } catch (err) {
    throw err;
  }
}

async function validateByEmail(queryString: URLSearchParams): Promise<void> {
  try {
    let newStudentEmail = queryString.get("searchTerm");
    if (!newStudentEmail) {
      throw new Error("Student email is required for validation");
    }
    newStudentEmail = newStudentEmail.trim().toLowerCase();

    const getAllStudents = await fetch(
      `https://${wiseBaseUrl}/institutes/v3/${wiseInstituteId}/students?${queryString.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${wiseAuthentication}`,
          "x-api-key": `${wiseApiKey}`,
          "x-wise-namespace": `${wiseNamespace}`,
          "Content-Type": "application/json",
          "User-Agent": `${wiseUserAgent}`,
        },
      },
    );
    if (!getAllStudents.ok) {
      throw new Error(
        "Unable to verify student details. Please try again later or contact support if the issue persists",
      );
    }
    const response: GetAllStudentResponse = await getAllStudents.json();
    if (response.data.count === 0) {
      return;
    }

    for (const student of response.data.students) {
      const sanitizedExistingStudent = student.email.trim().toLowerCase();
      if (sanitizedExistingStudent === newStudentEmail) {
        throw new Error(
          "This email address is already registered. Please use a different email or contact us if you need assistance",
        );
      }
    }

    return;
  } catch (err) {
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const student = reqBody;

    await validateByName(
      student,
      new URLSearchParams({
        status: "ACCEPTED",
        page_size: "1",
        page_number: "1",
        searchTerm: student.name,
      }),
    );

    await validateByEmail(
      new URLSearchParams({
        status: "ACCEPTED",
        page_size: "1",
        page_number: "1",
        searchTerm: student.email,
      }),
    );

    return Response.json(
      { message: "Student not registered" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ message: (err as Error).message }, { status: 500 });
  }
}

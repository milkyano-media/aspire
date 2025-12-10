import { getCourses } from "@/lib/db/queries";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { CourseTable } from "@/components/admin/CourseTable";

export default async function AdminPage() {
  const courses = await getCourses();

  return (
    <AdminAuth>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#070b30]">
          Course Administration
        </h1>
        {/* @ts-ignore */}
        <CourseTable courses={courses} />
      </div>
    </AdminAuth>
  );
}

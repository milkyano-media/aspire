import { getCourses } from "@/lib/db/queries";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { CourseTable } from "@/components/admin/CourseTable";
import { EmailComposerTab } from "@/components/admin/email/EmailComposerTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const courses = await getCourses();

  return (
    <AdminAuth>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#070b30]">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="email">Email Composer</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseTable courses={courses} />
          </TabsContent>

          <TabsContent value="email">
            <EmailComposerTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminAuth>
  );
}

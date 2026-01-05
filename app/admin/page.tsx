import { getCourses } from "@/lib/db/queries";
import { requireAdminOrTeacher } from "@/lib/auth/middleware";
import { CourseTable } from "@/components/admin/CourseTable";
import { EmailComposerTab } from "@/components/admin/email/EmailComposerTab";
import { UserManagementTab } from "@/components/admin/users/UserManagementTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function AdminPage() {
  const user = await requireAdminOrTeacher();
  const courses = await getCourses();
  const isAdmin = user.role === 'admin';

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#070b30]">
          {isAdmin ? 'Admin Dashboard' : 'Teacher Dashboard'}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <SignOutButton />
        </div>
      </div>

      <Tabs defaultValue={isAdmin ? "courses" : "email"} className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'} mb-8`}>
          {isAdmin && <TabsTrigger value="courses">Course Management</TabsTrigger>}
          <TabsTrigger value="email">Email Composer</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
        </TabsList>

        {isAdmin && (
          <TabsContent value="courses">
            <CourseTable courses={courses} />
          </TabsContent>
        )}

        <TabsContent value="email">
          <EmailComposerTab userRole={user.role} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

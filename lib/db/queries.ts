import { desc, and, eq, isNull, asc } from "drizzle-orm";
import { db } from "./drizzle";
import { activityLogs, teamMembers, teams, users, courses, Program } from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  },
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.team || null;
}

export async function getCourses(): Promise<Array<Omit<Program, 'includes'> & { includes: string[] }>> {
  const result = await db
    .select()
    .from(courses)
    .orderBy(asc(courses.courseOrder), asc(courses.id));

  return result.map((program) => ({
    ...program,
    includes: program.includes
      ? program.includes.split(";").filter(Boolean)
      : [],
  }));
}

export async function getCourseById(id: number) {
  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);

  if (result.length === 0) return null;

  const course = result[0];
  return {
    ...course,
    includes: course.includes ? course.includes.split(";").filter(Boolean) : [],
  };
}

export async function createCourse(data: typeof courses.$inferInsert) {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function updateCourse(id: number, data: Partial<typeof courses.$inferInsert>) {
  const [updated] = await db
    .update(courses)
    .set(data)
    .where(eq(courses.id, id))
    .returning();
  return updated;
}

export async function deleteCourse(id: number) {
  await db.delete(courses).where(eq(courses.id, id));
}

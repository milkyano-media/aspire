"use server";

import { z } from "zod";
import { validatedActionWithAdmin, ActionState } from "@/lib/auth/middleware";
import { db } from "@/lib/db/drizzle";
import { users, activityLogs, ActivityType } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/session";
import { eq, isNull, desc, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetch all users (admin only) - direct call version
 */
export async function fetchUsers() {
  const { getUser } = await import("@/lib/db/queries");
  const user = await getUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        wiseLmsTeacherId: users.wiseLmsTeacherId,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(desc(users.createdAt));

    return allUsers;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching users:", errorMessage);
    throw error;
  }
}

/**
 * List all users (admin only) - form action version
 */
const listUsersSchema = z.object({});

export const listUsers = validatedActionWithAdmin(
  listUsersSchema,
  async (data, formData, user): Promise<ActionState> => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          wiseLmsTeacherId: users.wiseLmsTeacherId,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(isNull(users.deletedAt))
        .orderBy(desc(users.createdAt));

      return { success: "Users fetched", data: allUsers };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching users:", errorMessage);
      return { error: `Failed to fetch users: ${errorMessage}` };
    }
  }
);

/**
 * Create teacher account (admin only)
 */
const createTeacherSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  wiseLmsTeacherId: z.string().optional(),
});

export const createTeacherAccount = validatedActionWithAdmin(
  createTeacherSchema,
  async (data, formData, user): Promise<ActionState> => {
    try {
      // Check if email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (existingUser.length > 0) {
        return { error: "Email already registered" };
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create teacher user
      const [newUser] = await db
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          passwordHash,
          role: "teacher",
          wiseLmsTeacherId: data.wiseLmsTeacherId || null,
        })
        .returning();

      // Log activity
      await db.insert(activityLogs).values({
        teamId: null,
        userId: user.id,
        action: ActivityType.CREATE_TEACHER_ACCOUNT,
        ipAddress: "",
      });

      revalidatePath("/admin");

      return {
        success: `Teacher account created: ${data.email}`,
        data: { userId: newUser.id },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating teacher account:", errorMessage);
      return { error: `Failed to create teacher account: ${errorMessage}` };
    }
  }
);

/**
 * Update user's WiseLMS Teacher ID (admin only)
 * Works for both teachers and admins
 */
const updateTeacherIdSchema = z.object({
  userId: z.coerce.number(),
  wiseLmsTeacherId: z.string().min(1, "WiseLMS Teacher ID is required"),
});

export const updateTeacherWiseLmsId = validatedActionWithAdmin(
  updateTeacherIdSchema,
  async (data, formData, user): Promise<ActionState> => {
    try {
      const [updated] = await db
        .update(users)
        .set({
          wiseLmsTeacherId: data.wiseLmsTeacherId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.userId))
        .returning();

      if (!updated) {
        return { error: "User not found" };
      }

      // Log activity
      await db.insert(activityLogs).values({
        teamId: null,
        userId: user.id,
        action: ActivityType.UPDATE_USER_ROLE,
        ipAddress: "",
      });

      revalidatePath("/admin");

      return { success: "WiseLMS Teacher ID updated" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating teacher ID:", errorMessage);
      return { error: `Failed to update teacher ID: ${errorMessage}` };
    }
  }
);

/**
 * Delete user (soft delete, admin only)
 */
const deleteUserSchema = z.object({
  userId: z.coerce.number(),
});

export const deleteUser = validatedActionWithAdmin(
  deleteUserSchema,
  async (data, formData, user): Promise<ActionState> => {
    try {
      // Prevent self-deletion
      if (data.userId === user.id) {
        return { error: "Cannot delete your own account" };
      }

      // Soft delete: set deletedAt timestamp and append user ID to email to free up the email
      await db
        .update(users)
        .set({
          deletedAt: sql`CURRENT_TIMESTAMP`,
          email: sql`CONCAT(email, '-', id, '-deleted')`,
        })
        .where(eq(users.id, data.userId));

      // Log activity
      await db.insert(activityLogs).values({
        teamId: null,
        userId: user.id,
        action: ActivityType.DELETE_USER_ACCOUNT,
        ipAddress: "",
      });

      revalidatePath("/admin");

      return { success: "User account deleted" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting user:", errorMessage);
      return { error: `Failed to delete user: ${errorMessage}` };
    }
  }
);

/**
 * Synchronize teacher accounts with WiseLMS
 * - Updates wiseLmsTeacherId for existing teachers
 * - Auto-creates accounts for new WiseLMS teachers
 */
const synchronizeTeachersSchema = z.object({});

export const synchronizeTeachers = validatedActionWithAdmin(
  synchronizeTeachersSchema,
  async (data, formData, user): Promise<ActionState> => {
    try {
      // Import getTeachers dynamically to avoid circular dependency
      const { getTeachers } = await import('@/lib/wiselms/api');

      // Fetch teachers from WiseLMS
      console.log('Starting teacher synchronization...');
      const wiseLmsTeachers = await getTeachers();

      if (wiseLmsTeachers.length === 0) {
        return { error: 'No teachers found in WiseLMS' };
      }

      // Create email-to-teacher mapping from WiseLMS
      const wiseLmsTeacherMap = new Map<string, typeof wiseLmsTeachers[0]>();
      wiseLmsTeachers.forEach(teacher => {
        const email = teacher.userId.email.toLowerCase().trim();
        wiseLmsTeacherMap.set(email, teacher);
      });

      console.log(`Built mapping for ${wiseLmsTeacherMap.size} WiseLMS teachers`);

      // Fetch ALL local teachers (to check which ones need updating vs creating)
      const allLocalTeachers = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          wiseLmsTeacherId: users.wiseLmsTeacherId,
        })
        .from(users)
        .where(
          and(
            eq(users.role, 'teacher'),
            isNull(users.deletedAt)
          )
        );

      // Create email set of existing local teachers
      const localTeacherEmails = new Set(
        allLocalTeachers.map(t => t.email.toLowerCase().trim())
      );

      console.log(`Found ${allLocalTeachers.length} existing local teachers`);

      let syncedCount = 0;
      let createdCount = 0;
      const operations: Promise<any>[] = [];

      // Process existing teachers (update wiseLmsTeacherId if missing)
      for (const teacher of allLocalTeachers) {
        // Skip if already has wiseLmsTeacherId
        if (teacher.wiseLmsTeacherId) {
          continue;
        }

        const email = teacher.email.toLowerCase().trim();
        const wiseLmsTeacher = wiseLmsTeacherMap.get(email);

        if (wiseLmsTeacher) {
          console.log(`Updating teacher: ${teacher.name} (${email}) -> ${wiseLmsTeacher.userId._id}`);

          operations.push(
            db
              .update(users)
              .set({
                wiseLmsTeacherId: wiseLmsTeacher.userId._id,
                updatedAt: new Date(),
              })
              .where(eq(users.id, teacher.id))
          );

          syncedCount++;
        }
      }

      // Process new WiseLMS teachers (create accounts)
      for (const [email, wiseLmsTeacher] of wiseLmsTeacherMap.entries()) {
        // Skip if teacher already exists locally
        if (localTeacherEmails.has(email)) {
          continue;
        }

        console.log(`Creating new teacher account: ${wiseLmsTeacher.userId.name} (${email})`);

        // Use default password for auto-created accounts
        const defaultPassword = 'AspireOnTop1$';
        const passwordHash = await hashPassword(defaultPassword);

        operations.push(
          db.insert(users).values({
            name: wiseLmsTeacher.userId.name,
            email: wiseLmsTeacher.userId.email,
            passwordHash,
            role: 'teacher',
            wiseLmsTeacherId: wiseLmsTeacher.userId._id,
          })
        );

        createdCount++;
      }

      // Execute all operations in parallel
      if (operations.length > 0) {
        await Promise.all(operations);
      }

      // Log activity
      await db.insert(activityLogs).values({
        teamId: null,
        userId: user.id,
        action: ActivityType.UPDATE_USER_ROLE, // Reuse existing activity type
        ipAddress: '',
      });

      revalidatePath('/admin');

      // Build success message
      const messages: string[] = [];
      if (syncedCount > 0) {
        messages.push(`${syncedCount} teacher${syncedCount === 1 ? '' : 's'} synchronized`);
      }
      if (createdCount > 0) {
        messages.push(`${createdCount} teacher${createdCount === 1 ? '' : 's'} created`);
      }

      const message = messages.length > 0
        ? `Successfully ${messages.join(' and ')}`
        : 'All teachers are already synchronized';

      return {
        success: message,
        data: {
          syncedCount,
          createdCount,
          totalWiseLmsTeachers: wiseLmsTeachers.length,
          totalLocalTeachers: allLocalTeachers.length,
        },
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error synchronizing teachers:', errorMessage);
      return { error: `Failed to synchronize teachers: ${errorMessage}` };
    }
  }
);

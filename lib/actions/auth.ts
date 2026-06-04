'use server';

import { authenticateUser, createSession, destroySession, getCurrentUser, hashPassword, createAuditLog } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { loginSchema, type ActionResponse } from '@/lib/validations';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// =============================================================================
// LOGIN
// =============================================================================

export async function login(formData: unknown): Promise<ActionResponse> {
  try {
    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { email, password } = parsed.data;
    const user = await authenticateUser(email, password);

    if (!user) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    await createSession(user.id);

    await createAuditLog({
      userId: user.id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user.id,
    });

    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ في تسجيل الدخول' };
  }
}

// =============================================================================
// LOGOUT
// =============================================================================

export async function logout(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await createAuditLog({
      userId: user.id,
      action: 'LOGOUT',
      resource: 'User',
      resourceId: user.id,
    });
  }

  await destroySession();
  redirect('/login');
}

// =============================================================================
// GET CURRENT SESSION
// =============================================================================

export async function getSession(): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'غير مصرح' };
    }
    return { success: true, data: user };
  } catch {
    return { success: false, error: 'غير مصرح' };
  }
}

// =============================================================================
// USER MANAGEMENT
// =============================================================================

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (params?.role) where.role = params.role;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, role: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      resource: 'User',
      resourceId: userId,
      newData: { role },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleUserActive(userId: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) return { success: false, error: 'المستخدم غير موجود' };

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !target.isActive },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetUserPassword(userId: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const newPassword = await hashPassword('reset123');
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      resource: 'User',
      resourceId: userId,
      newData: { passwordReset: true },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import prisma from './prisma';
import bcrypt from 'bcryptjs';

// =============================================================================
// ROLE DEFINITIONS & PERMISSIONS
// =============================================================================

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  ACCOUNTANT: 'ACCOUNTANT',
  HR_MANAGER: 'HR_MANAGER',
  LIBRARIAN: 'LIBRARIAN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
} as const;

export type Role = keyof typeof ROLES;

// Permission matrix: role -> [allowed resources]
const PERMISSIONS: Record<string, Record<string, string[]>> = {
  SUPER_ADMIN: {
    '*': ['*'], // Full access
  },
  ADMIN: {
    students: ['view', 'create', 'edit', 'delete', 'export'],
    attendance: ['view', 'create', 'edit', 'export'],
    grades: ['view', 'create', 'edit', 'approve', 'export'],
    finance: ['view', 'create', 'edit', 'export'],
    hr: ['view', 'create', 'edit', 'export'],
    academic: ['view', 'create', 'edit'],
    library: ['view', 'create', 'edit'],
    transport: ['view', 'create', 'edit'],
    procurement: ['view', 'create', 'edit', 'approve'],
    assets: ['view', 'create', 'edit'],
    communication: ['view', 'create'],
    reports: ['view', 'export'],
    settings: ['view', 'edit'],
    users: ['view', 'create', 'edit'],
    audit: ['view'],
  },
  TEACHER: {
    students: ['view'],
    attendance: ['view', 'create', 'edit'],
    grades: ['view', 'create', 'edit'],
    academic: ['view'],
    communication: ['view', 'create'],
    reports: ['view'],
  },
  ACCOUNTANT: {
    students: ['view'],
    finance: ['view', 'create', 'edit', 'export'],
    reports: ['view', 'export'],
  },
  HR_MANAGER: {
    hr: ['view', 'create', 'edit', 'delete', 'export'],
    reports: ['view', 'export'],
  },
  LIBRARIAN: {
    library: ['view', 'create', 'edit', 'delete'],
    students: ['view'],
  },
  PARENT: {
    students: ['view'], // Only their children
    attendance: ['view'],
    grades: ['view'],
    finance: ['view'],
    communication: ['view'],
  },
  STUDENT: {
    attendance: ['view'],
    grades: ['view'],
    library: ['view'],
    communication: ['view'],
  },
};

export function hasPermission(role: string, resource: string, action: string): boolean {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;

  // Super admin has all permissions
  if (rolePerms['*']?.includes('*')) return true;

  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) return false;

  return resourcePerms.includes(action) || resourcePerms.includes('*');
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    SUPER_ADMIN: 'مدير النظام',
    ADMIN: 'مدير المدرسة',
    TEACHER: 'معلم',
    ACCOUNTANT: 'محاسب',
    HR_MANAGER: 'مدير الموارد البشرية',
    LIBRARIAN: 'أمين المكتبة',
    PARENT: 'ولي أمر',
    STUDENT: 'طالب',
  };
  return labels[role] || role;
}

// =============================================================================
// AUTHENTICATION HELPERS
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
}

// =============================================================================
// SESSION MANAGEMENT (Cookie-based for simplicity)
// =============================================================================

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'school-erp-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return sessionToken;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session || session.expires < new Date()) {
      // Clean up expired session
      if (session) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      }
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId, deletedAt: null, isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        employee: {
          select: {
            id: true,
            employeeNumber: true,
            departmentId: true,
          },
        },
        student: {
          select: {
            id: true,
            studentNumber: true,
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({ where: { sessionToken } }).catch(() => {});
      cookieStore.delete(SESSION_COOKIE);
    }
  } catch {
    // ignore
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// =============================================================================
// AUDIT LOGGING
// =============================================================================

export async function createAuditLog(params: {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldData?: unknown;
  newData?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        oldData: params.oldData ? JSON.stringify(params.oldData) : null,
        newData: params.newData ? JSON.stringify(params.newData) : null,
      },
    });
  } catch {
    console.error('Failed to create audit log');
  }
}

// =============================================================================
// AUTO-NUMBERING
// =============================================================================

export async function generateStudentNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.student.count();
  return `STU-${year}-${String(count + 1).padStart(4, '0')}`;
}

export async function generateEmployeeNumber(): Promise<string> {
  const count = await prisma.employee.count();
  return `EMP-${String(count + 1).padStart(4, '0')}`;
}

export async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const todayCount = await prisma.invoice.count({
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    },
  });
  return `INV-${dateStr}-${String(todayCount + 1).padStart(3, '0')}`;
}

export async function generatePaymentNumber(): Promise<string> {
  const now = new Date();
  const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const todayCount = await prisma.payment.count({
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      },
    },
  });
  return `PAY-${dateStr}-${String(todayCount + 1).padStart(3, '0')}`;
}

export async function generateOrderNumber(): Promise<string> {
  const count = await prisma.purchaseOrder.count();
  return `PO-${String(count + 1).padStart(4, '0')}`;
}

export async function generateContractNumber(): Promise<string> {
  const count = await prisma.contract.count();
  return `CONT-${String(count + 1).padStart(3, '0')}`;
}

export async function generateAssetNumber(): Promise<string> {
  const count = await prisma.asset.count();
  return `AST-${String(count + 1).padStart(4, '0')}`;
}

export async function generateApplicationNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.admissionApplication.count();
  return `APP-${year}-${String(count + 1).padStart(4, '0')}`;
}

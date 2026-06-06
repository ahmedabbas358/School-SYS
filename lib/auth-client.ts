// =============================================================================
// CLIENT-SAFE AUTH UTILITIES
// This file contains only pure functions with no server-only imports.
// Safe to import from 'use client' components.
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

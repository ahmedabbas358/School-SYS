'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, createAuditLog } from '@/lib/auth';
import { type ActionResponse } from '@/lib/validations';

// =============================================================================
// ACADEMIC YEARS
// =============================================================================

export async function getAcademicYears(): Promise<ActionResponse> {
  try {
    const years = await prisma.academicYear.findMany({
      include: {
        terms: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    return { success: true, data: years };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentAcademicYear(): Promise<ActionResponse> {
  try {
    const year = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
      include: { terms: true },
    });
    return { success: true, data: year };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAcademicYear(data: {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    if (data.isCurrent) {
      await prisma.academicYear.updateMany({ data: { isCurrent: false } });
    }

    const year = await prisma.academicYear.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: data.isCurrent || false,
      },
    });

    revalidatePath('/academic');
    revalidatePath('/settings');
    return { success: true, data: year };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTerm(data: {
  name: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}): Promise<ActionResponse> {
  try {
    if (data.isCurrent) {
      await prisma.term.updateMany({ data: { isCurrent: false } });
    }
    const term = await prisma.term.create({
      data: {
        name: data.name,
        academicYearId: data.academicYearId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: data.isCurrent || false,
      },
    });
    revalidatePath('/academic');
    return { success: true, data: term };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// STAGES, GRADES, SECTIONS
// =============================================================================

export async function getAcademicStructure(): Promise<ActionResponse> {
  try {
    const stages = await prisma.stage.findMany({
      include: {
        grades: {
          include: {
            sections: {
              include: {
                _count: { select: { enrollments: true } },
              },
            },
            _count: { select: { subjects: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: stages };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStage(data: { name: string; order?: number }): Promise<ActionResponse> {
  try {
    const stage = await prisma.stage.create({ data });
    revalidatePath('/academic');
    return { success: true, data: stage };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createGrade(data: { name: string; stageId: string; order?: number }): Promise<ActionResponse> {
  try {
    const grade = await prisma.grade.create({ data });
    revalidatePath('/academic');
    return { success: true, data: grade };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSection(data: { name: string; gradeId: string; capacity?: number }): Promise<ActionResponse> {
  try {
    const section = await prisma.section.create({ data });
    revalidatePath('/academic');
    return { success: true, data: section };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// SUBJECTS
// =============================================================================

export async function getSubjects(gradeId?: string): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (gradeId) where.gradeId = gradeId;

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        grade: { include: { stage: true } },
        department: true,
        teacherSubjects: {
          include: { employee: { include: { user: { select: { name: true } } } } },
        },
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: subjects };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSubject(data: {
  name: string;
  code: string;
  gradeId: string;
  departmentId?: string;
  weeklyPeriods?: number;
  maxScore?: number;
  passScore?: number;
}): Promise<ActionResponse> {
  try {
    const existing = await prisma.subject.findUnique({ where: { code: data.code } });
    if (existing) return { success: false, error: 'رمز المادة مستخدم بالفعل' };

    const subject = await prisma.subject.create({ data });
    revalidatePath('/academic');
    return { success: true, data: subject };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// DEPARTMENTS
// =============================================================================

export async function getDepartments(): Promise<ActionResponse> {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: { select: { employees: true, subjects: true } },
      },
    });
    return { success: true, data: departments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDepartment(data: { name: string; headId?: string }): Promise<ActionResponse> {
  try {
    const dept = await prisma.department.create({ data });
    revalidatePath('/academic');
    return { success: true, data: dept };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// SECTIONS LIST (for dropdowns)
// =============================================================================

export async function getSections(gradeId?: string): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (gradeId) where.gradeId = gradeId;

    const sections = await prisma.section.findMany({
      where,
      include: {
        grade: { include: { stage: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ grade: { order: 'asc' } }, { name: 'asc' }],
    });
    return { success: true, data: sections };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

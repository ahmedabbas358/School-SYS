'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { type ActionResponse } from '@/lib/validations';

const ACADEMIC_CACHE_TAG = 'academic-core';
const ACADEMIC_CACHE_REVALIDATE_SECONDS = 300;

function revalidateAcademicData() {
  revalidateTag(ACADEMIC_CACHE_TAG);
  revalidatePath('/academic');
}

const getCachedAcademicYears = unstable_cache(
  async () => prisma.academicYear.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      isCurrent: true,
      terms: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
        },
        orderBy: { startDate: 'asc' },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { startDate: 'desc' },
  }),
  ['academic-years-v1'],
  { tags: [ACADEMIC_CACHE_TAG], revalidate: ACADEMIC_CACHE_REVALIDATE_SECONDS }
);

const getCachedCurrentAcademicYear = unstable_cache(
  async () => prisma.academicYear.findFirst({
    where: { isCurrent: true },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      isCurrent: true,
      terms: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
        },
        orderBy: { startDate: 'asc' },
      },
    },
  }),
  ['current-academic-year-v1'],
  { tags: [ACADEMIC_CACHE_TAG], revalidate: ACADEMIC_CACHE_REVALIDATE_SECONDS }
);

const getCachedAcademicStructure = unstable_cache(
  async () => prisma.stage.findMany({
    select: {
      id: true,
      name: true,
      order: true,
      grades: {
        select: {
          id: true,
          name: true,
          order: true,
          sections: {
            select: {
              id: true,
              name: true,
              capacity: true,
              _count: { select: { enrollments: true } },
            },
            orderBy: { name: 'asc' },
          },
          _count: { select: { subjects: true } },
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  }),
  ['academic-structure-v1'],
  { tags: [ACADEMIC_CACHE_TAG], revalidate: ACADEMIC_CACHE_REVALIDATE_SECONDS }
);

const getCachedSubjects = unstable_cache(
  async (gradeId?: string) => {
    const where = gradeId ? { gradeId } : {};

    return prisma.subject.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        weeklyPeriods: true,
        maxScore: true,
        passScore: true,
        grade: {
          select: {
            id: true,
            name: true,
            stage: { select: { id: true, name: true } },
          },
        },
        department: { select: { id: true, name: true } },
        teacherSubjects: {
          select: {
            id: true,
            employee: {
              select: {
                id: true,
                employeeNumber: true,
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  },
  ['academic-subjects-v1'],
  { tags: [ACADEMIC_CACHE_TAG], revalidate: ACADEMIC_CACHE_REVALIDATE_SECONDS }
);

const getCachedSections = unstable_cache(
  async (gradeId?: string) => {
    const where = gradeId ? { gradeId } : {};

    return prisma.section.findMany({
      where,
      select: {
        id: true,
        name: true,
        capacity: true,
        grade: {
          select: {
            id: true,
            name: true,
            order: true,
            stage: { select: { id: true, name: true, order: true } },
          },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: [{ grade: { order: 'asc' } }, { name: 'asc' }],
    });
  },
  ['academic-sections-v1'],
  { tags: [ACADEMIC_CACHE_TAG], revalidate: ACADEMIC_CACHE_REVALIDATE_SECONDS }
);

// =============================================================================
// ACADEMIC YEARS
// =============================================================================

export async function getAcademicYears(): Promise<ActionResponse> {
  try {
    const years = await getCachedAcademicYears();
    return { success: true, data: years };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentAcademicYear(): Promise<ActionResponse> {
  try {
    const year = await getCachedCurrentAcademicYear();
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

    revalidateAcademicData();
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
    revalidateAcademicData();
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
    const stages = await getCachedAcademicStructure();
    return { success: true, data: stages };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStage(data: { name: string; order?: number }): Promise<ActionResponse> {
  try {
    const stage = await prisma.stage.create({ data });
    revalidateAcademicData();
    return { success: true, data: stage };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createGrade(data: { name: string; stageId: string; order?: number }): Promise<ActionResponse> {
  try {
    const grade = await prisma.grade.create({ data });
    revalidateAcademicData();
    return { success: true, data: grade };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createSection(data: { name: string; gradeId: string; capacity?: number }): Promise<ActionResponse> {
  try {
    const section = await prisma.section.create({ data });
    revalidateAcademicData();
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
    const subjects = await getCachedSubjects(gradeId);
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
    revalidateAcademicData();
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
    revalidateAcademicData();
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
    const sections = await getCachedSections(gradeId);
    return { success: true, data: sections };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

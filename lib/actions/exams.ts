'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, createAuditLog } from '@/lib/auth';
import { enterGradesSchema, type ActionResponse } from '@/lib/validations';

// =============================================================================
// EXAM PERIODS
// =============================================================================

export async function getExamPeriods(params?: {
  academicYearId?: string;
  termId?: string;
  status?: string;
}): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (params?.academicYearId) where.academicYearId = params.academicYearId;
    if (params?.termId) where.termId = params.termId;
    if (params?.status) where.status = params.status;

    const periods = await prisma.examPeriod.findMany({
      where,
      include: {
        academicYear: true,
        term: true,
        grade: { include: { stage: true } },
        _count: { select: { gradeEntries: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: periods };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createExamPeriod(data: {
  name: string;
  type: string;
  academicYearId: string;
  termId: string;
  gradeId?: string;
  startDate?: string;
  endDate?: string;
  maxScore?: number;
  weight?: number;
}): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const period = await prisma.examPeriod.create({
      data: {
        name: data.name,
        type: data.type,
        academicYearId: data.academicYearId,
        termId: data.termId,
        gradeId: data.gradeId,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        maxScore: data.maxScore || 100,
        weight: data.weight || 1.0,
      },
    });

    revalidatePath('/exams');
    return { success: true, data: period };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// ENTER GRADES (BULK)
// =============================================================================

export async function enterGrades(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = enterGradesSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { examPeriodId, subjectId, entries } = parsed.data;

    // Get grading scale for auto letter grade
    const scales = await prisma.gradingScale.findMany({ orderBy: { minScore: 'desc' } });

    await prisma.$transaction(async (tx) => {
      for (const entry of entries) {
        // Determine letter grade
        let letterGrade = '';
        for (const scale of scales) {
          if (entry.score >= scale.minScore && entry.score <= scale.maxScore) {
            letterGrade = scale.name;
            break;
          }
        }

        await tx.gradeEntry.upsert({
          where: {
            studentId_subjectId_examPeriodId: {
              studentId: entry.studentId,
              subjectId,
              examPeriodId,
            },
          },
          create: {
            studentId: entry.studentId,
            subjectId,
            examPeriodId,
            score: entry.score,
            letterGrade,
            notes: entry.notes,
            enteredBy: user.id,
            status: 'SUBMITTED',
          },
          update: {
            score: entry.score,
            letterGrade,
            notes: entry.notes,
            enteredBy: user.id,
          },
        });
      }
    });

    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      resource: 'GradeEntry',
      newData: { examPeriodId, subjectId, count: entries.length },
    });

    revalidatePath('/exams');
    return { success: true, data: { count: entries.length } };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ في إدخال الدرجات' };
  }
}

// =============================================================================
// APPROVE GRADES
// =============================================================================

export async function approveGrades(examPeriodId: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    await prisma.$transaction(async (tx) => {
      await tx.gradeEntry.updateMany({
        where: { examPeriodId, status: 'SUBMITTED' },
        data: { status: 'APPROVED' },
      });

      await tx.examPeriod.update({
        where: { id: examPeriodId },
        data: { status: 'APPROVED', approvedBy: user.id, approvedAt: new Date() },
      });
    });

    await createAuditLog({
      userId: user.id,
      action: 'APPROVE',
      resource: 'ExamPeriod',
      resourceId: examPeriodId,
    });

    revalidatePath('/exams');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// GET GRADES FOR STUDENT
// =============================================================================

export async function getStudentGrades(studentId: string, params?: {
  academicYearId?: string;
  termId?: string;
}): Promise<ActionResponse> {
  try {
    const where: any = { studentId };
    if (params?.academicYearId) {
      where.examPeriod = { academicYearId: params.academicYearId };
    }
    if (params?.termId) {
      where.examPeriod = { ...where.examPeriod, termId: params.termId };
    }

    const grades = await prisma.gradeEntry.findMany({
      where,
      include: {
        subject: true,
        examPeriod: { include: { term: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate averages by subject
    const subjectAverages: Record<string, { name: string; total: number; count: number; avg: number }> = {};
    for (const grade of grades) {
      if (grade.score !== null) {
        if (!subjectAverages[grade.subjectId]) {
          subjectAverages[grade.subjectId] = { name: grade.subject.name, total: 0, count: 0, avg: 0 };
        }
        subjectAverages[grade.subjectId].total += grade.score;
        subjectAverages[grade.subjectId].count += 1;
        subjectAverages[grade.subjectId].avg = subjectAverages[grade.subjectId].total / subjectAverages[grade.subjectId].count;
      }
    }

    // Overall GPA
    const validGrades = grades.filter(g => g.score !== null);
    const overallAvg = validGrades.length > 0
      ? validGrades.reduce((sum, g) => sum + (g.score || 0), 0) / validGrades.length
      : 0;

    return {
      success: true,
      data: {
        grades,
        subjectAverages: Object.values(subjectAverages),
        overallAverage: overallAvg.toFixed(1),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// GET GRADES FOR SECTION (for teachers)
// =============================================================================

export async function getSectionGrades(params: {
  sectionId: string;
  subjectId: string;
  examPeriodId: string;
}): Promise<ActionResponse> {
  try {
    // Get students in section
    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId: params.sectionId, status: 'ACTIVE' },
      include: {
        student: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    // Get existing grades
    const grades = await prisma.gradeEntry.findMany({
      where: {
        subjectId: params.subjectId,
        examPeriodId: params.examPeriodId,
        studentId: { in: enrollments.map(e => e.studentId) },
      },
    });

    const gradeMap = new Map(grades.map(g => [g.studentId, g]));

    const data = enrollments.map(e => ({
      studentId: e.student.id,
      studentName: e.student.user.name,
      studentNumber: e.student.studentNumber,
      score: gradeMap.get(e.student.id)?.score || null,
      letterGrade: gradeMap.get(e.student.id)?.letterGrade || '',
      status: gradeMap.get(e.student.id)?.status || 'NOT_ENTERED',
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// EXAM STATS
// =============================================================================

export async function getExamStats(): Promise<ActionResponse> {
  try {
    const [totalPeriods, activePeriods, totalEntries, pendingApproval] = await Promise.all([
      prisma.examPeriod.count(),
      prisma.examPeriod.count({ where: { status: 'ACTIVE' } }),
      prisma.gradeEntry.count(),
      prisma.gradeEntry.count({ where: { status: 'SUBMITTED' } }),
    ]);

    return {
      success: true,
      data: { totalPeriods, activePeriods, totalEntries, pendingApproval },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// GRADING SCALE MANAGEMENT
// =============================================================================

export async function getGradingScales(): Promise<ActionResponse> {
  try {
    const scales = await prisma.gradingScale.findMany({ orderBy: { minScore: 'desc' } });
    return { success: true, data: scales };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

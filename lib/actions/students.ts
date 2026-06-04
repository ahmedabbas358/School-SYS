'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, createAuditLog, generateStudentNumber, hashPassword } from '@/lib/auth';
import { createStudentSchema, updateStudentSchema, type ActionResponse, type PaginationParams } from '@/lib/validations';

// =============================================================================
// GET STUDENTS (with search, filter, pagination)
// =============================================================================

export async function getStudents(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  gradeId?: string;
  sectionId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<ActionResponse> {
  try {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (params.search) {
      where.OR = [
        { user: { name: { contains: params.search } } },
        { studentNumber: { contains: params.search } },
        { nationalId: { contains: params.search } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.sectionId) {
      where.enrollments = {
        some: { sectionId: params.sectionId },
      };
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          enrollments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              section: {
                include: {
                  grade: {
                    include: { stage: true },
                  },
                },
              },
              academicYear: true,
            },
          },
          guardians: {
            include: {
              guardian: {
                include: { user: { select: { name: true } } },
              },
            },
            take: 1,
          },
          attendances: {
            where: {
              date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              },
            },
          },
          behaviorRecords: {
            orderBy: { date: 'desc' },
            take: 3,
          },
        },
        orderBy: { createdAt: params.sortOrder || 'desc' },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return {
      success: true,
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ في جلب بيانات الطلاب' };
  }
}

// =============================================================================
// GET STUDENT BY ID
// =============================================================================

export async function getStudentById(id: string): Promise<ActionResponse> {
  try {
    const student = await prisma.student.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        enrollments: {
          include: {
            section: {
              include: { grade: { include: { stage: true } } },
            },
            academicYear: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        guardians: {
          include: {
            guardian: {
              include: { user: { select: { name: true, email: true } } },
            },
          },
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        gradeEntries: {
          include: {
            subject: true,
            examPeriod: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        behaviorRecords: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        invoices: {
          include: { payments: true },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        bookLoans: {
          include: { book: true },
          orderBy: { loanDate: 'desc' },
          take: 5,
        },
        transportAssignment: {
          include: { route: { include: { vehicle: true } } },
        },
      },
    });

    if (!student) {
      return { success: false, error: 'الطالب غير موجود' };
    }

    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ' };
  }
}

// =============================================================================
// CREATE STUDENT
// =============================================================================

export async function createStudent(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = createStudentSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;

    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
    }

    // Get current academic year
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    });
    if (!currentYear) {
      return { success: false, error: 'لا يوجد عام دراسي حالي. يرجى إعداده في الإعدادات' };
    }

    const studentNumber = await generateStudentNumber();
    const hashedPassword = await hashPassword('student123'); // Default password

    const student = await prisma.$transaction(async (tx) => {
      // Create user account
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: 'STUDENT',
        },
      });

      // Create student profile
      const newStudent = await tx.student.create({
        data: {
          userId: newUser.id,
          studentNumber,
          nationalId: data.nationalId,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          nationality: data.nationality,
          address: data.address,
          previousSchool: data.previousSchool,
          specialNeeds: data.specialNeeds,
        },
      });

      // Create enrollment
      await tx.enrollment.create({
        data: {
          studentId: newStudent.id,
          academicYearId: currentYear.id,
          sectionId: data.sectionId,
        },
      });

      // Create guardian
      if (data.guardianName) {
        const guardianEmail = data.guardianEmail || `guardian_${Date.now()}@placeholder.local`;
        const guardianPassword = await hashPassword('guardian123');

        const guardianUser = await tx.user.create({
          data: {
            email: guardianEmail,
            password: guardianPassword,
            name: data.guardianName,
            role: 'PARENT',
          },
        });

        const guardian = await tx.guardian.create({
          data: {
            userId: guardianUser.id,
            phone: data.guardianPhone,
            relationship: data.guardianRelationship,
            nationalId: data.guardianNationalId,
            address: data.guardianAddress,
          },
        });

        await tx.studentGuardian.create({
          data: {
            studentId: newStudent.id,
            guardianId: guardian.id,
            isPrimary: true,
          },
        });
      }

      return newStudent;
    });

    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      resource: 'Student',
      resourceId: student.id,
      newData: { studentNumber, name: data.name },
    });

    revalidatePath('/students');
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ في إنشاء الطالب' };
  }
}

// =============================================================================
// UPDATE STUDENT
// =============================================================================

export async function updateStudent(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = updateStudentSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { id, ...data } = parsed.data;

    const existing = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      return { success: false, error: 'الطالب غير موجود' };
    }

    await prisma.$transaction(async (tx) => {
      // Update user name if provided
      if (data.name) {
        await tx.user.update({
          where: { id: existing.userId },
          data: { name: data.name },
        });
      }

      // Update student profile
      await tx.student.update({
        where: { id },
        data: {
          nationalId: data.nationalId,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          nationality: data.nationality,
          address: data.address,
          status: data.status,
          specialNeeds: data.specialNeeds,
        },
      });
    });

    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      resource: 'Student',
      resourceId: id,
      oldData: { name: existing.user.name, status: existing.status },
      newData: data,
    });

    revalidatePath('/students');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ' };
  }
}

// =============================================================================
// DELETE STUDENT (Soft Delete)
// =============================================================================

export async function deleteStudent(id: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    await prisma.student.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'WITHDRAWN' },
    });

    await createAuditLog({
      userId: user.id,
      action: 'DELETE',
      resource: 'Student',
      resourceId: id,
    });

    revalidatePath('/students');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ' };
  }
}

// =============================================================================
// GET STUDENT STATS (for Dashboard)
// =============================================================================

export async function getStudentStats(): Promise<ActionResponse> {
  try {
    const [total, active, withdrawn, graduated] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.student.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.student.count({ where: { status: 'WITHDRAWN', deletedAt: null } }),
      prisma.student.count({ where: { status: 'GRADUATED', deletedAt: null } }),
    ]);

    return {
      success: true,
      data: { total, active, withdrawn, graduated },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

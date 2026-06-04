'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, createAuditLog, generateEmployeeNumber, generateContractNumber, hashPassword } from '@/lib/auth';
import { createEmployeeSchema, createLeaveRequestSchema, createContractSchema, type ActionResponse } from '@/lib/validations';

// =============================================================================
// GET EMPLOYEES
// =============================================================================

export async function getEmployees(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  departmentId?: string;
  employmentType?: string;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (params?.status) where.status = params.status;
    if (params?.departmentId) where.departmentId = params.departmentId;
    if (params?.employmentType) where.employmentType = params.employmentType;
    if (params?.search) {
      where.OR = [
        { user: { name: { contains: params.search } } },
        { employeeNumber: { contains: params.search } },
        { position: { contains: params.search } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, role: true } },
          department: true,
          contracts: { where: { status: 'ACTIVE' }, take: 1, orderBy: { startDate: 'desc' } },
          leaveBalances: { where: { year: new Date().getFullYear() } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      success: true,
      data: employees,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// CREATE EMPLOYEE
// =============================================================================

export async function createEmployee(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = createEmployeeSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const employeeNumber = await generateEmployeeNumber();
    const hashedPassword = await hashPassword('emp123');

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return { success: false, error: 'البريد الإلكتروني مستخدم' };

    const employee = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
        },
      });

      const newEmployee = await tx.employee.create({
        data: {
          userId: newUser.id,
          employeeNumber,
          nationalId: data.nationalId,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          phone: data.phone,
          address: data.address,
          qualification: data.qualification,
          specialization: data.specialization,
          position: data.position,
          departmentId: data.departmentId || undefined,
          employmentType: data.employmentType,
          basicSalary: data.basicSalary,
        },
      });

      // Create default leave balances
      const year = new Date().getFullYear();
      await tx.leaveBalance.createMany({
        data: [
          { employeeId: newEmployee.id, type: 'ANNUAL', total: 30, remaining: 30, year },
          { employeeId: newEmployee.id, type: 'SICK', total: 15, remaining: 15, year },
          { employeeId: newEmployee.id, type: 'EMERGENCY', total: 5, remaining: 5, year },
        ],
      });

      return newEmployee;
    });

    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      resource: 'Employee',
      resourceId: employee.id,
      newData: { employeeNumber, name: data.name, position: data.position },
    });

    revalidatePath('/hr');
    return { success: true, data: employee };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// LEAVE REQUESTS
// =============================================================================

export async function submitLeaveRequest(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = createLeaveRequestSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check balance
    const balance = await prisma.leaveBalance.findFirst({
      where: {
        employeeId: data.employeeId,
        type: data.type,
        year: new Date().getFullYear(),
      },
    });

    if (balance && balance.remaining < days) {
      return { success: false, error: `رصيد الإجازات غير كافٍ. المتبقي: ${balance.remaining} يوم` };
    }

    const request = await prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        startDate: start,
        endDate: end,
        days,
        reason: data.reason,
      },
    });

    revalidatePath('/hr');
    return { success: true, data: request };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveLeaveRequest(id: string, approve: boolean, note?: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const request = await prisma.leaveRequest.findUnique({ where: { id } });
    if (!request) return { success: false, error: 'الطلب غير موجود' };

    if (approve) {
      await prisma.$transaction(async (tx) => {
        await tx.leaveRequest.update({
          where: { id },
          data: { status: 'APPROVED', approvedBy: user.id, approvedAt: new Date() },
        });

        // Deduct from balance
        await tx.leaveBalance.updateMany({
          where: {
            employeeId: request.employeeId,
            type: request.type,
            year: new Date().getFullYear(),
          },
          data: {
            used: { increment: request.days },
            remaining: { decrement: request.days },
          },
        });
      });
    } else {
      await prisma.leaveRequest.update({
        where: { id },
        data: { status: 'REJECTED', rejectionNote: note, approvedBy: user.id, approvedAt: new Date() },
      });
    }

    revalidatePath('/hr');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLeaveRequests(params?: {
  status?: string;
  employeeId?: string;
}): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.employeeId) where.employeeId = params.employeeId;

    const requests = await prisma.leaveRequest.findMany({
      where,
      include: {
        employee: { include: { user: { select: { name: true } }, department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: requests };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// CONTRACTS
// =============================================================================

export async function createContract(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = createContractSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const contractNumber = await generateContractNumber();

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        employeeId: data.employeeId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        salary: data.salary,
        allowances: data.allowances,
        notes: data.notes,
      },
    });

    revalidatePath('/hr');
    return { success: true, data: contract };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// PAYROLL
// =============================================================================

export async function processPayroll(month: number, year: number): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const employees = await prisma.employee.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      include: {
        contracts: { where: { status: 'ACTIVE' }, take: 1, orderBy: { startDate: 'desc' } },
      },
    });

    let processedCount = 0;

    for (const emp of employees) {
      const existing = await prisma.payrollEntry.findFirst({
        where: { employeeId: emp.id, month, year },
      });

      if (existing) continue;

      const activeContract = emp.contracts[0];
      const basicSalary = activeContract?.salary || emp.basicSalary;
      const allowances = activeContract?.allowances || 0;

      await prisma.payrollEntry.create({
        data: {
          employeeId: emp.id,
          month,
          year,
          basicSalary,
          allowances,
          deductions: 0,
          overtime: 0,
          netSalary: basicSalary + allowances,
        },
      });

      processedCount++;
    }

    revalidatePath('/hr');
    return { success: true, data: { processedCount } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// HR STATS
// =============================================================================

export async function getHRStats(): Promise<ActionResponse> {
  try {
    const [totalActive, teachers, admins, pendingLeaves, expiringSoon] = await Promise.all([
      prisma.employee.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.employee.count({
        where: { status: 'ACTIVE', deletedAt: null, user: { role: 'TEACHER' } },
      }),
      prisma.employee.count({
        where: { status: 'ACTIVE', deletedAt: null, user: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } },
      }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.contract.count({
        where: {
          status: 'ACTIVE',
          endDate: {
            lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            gte: new Date(),
          },
        },
      }),
    ]);

    // Monthly payroll total
    const now = new Date();
    const payroll = await prisma.payrollEntry.aggregate({
      _sum: { netSalary: true },
      where: { month: now.getMonth() + 1, year: now.getFullYear() },
    });

    return {
      success: true,
      data: {
        totalActive,
        teachers,
        admins,
        pendingLeaves,
        expiringSoon,
        monthlyPayroll: payroll._sum.netSalary || 0,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

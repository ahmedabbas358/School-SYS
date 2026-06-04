'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, createAuditLog } from '@/lib/auth';
import { type ActionResponse } from '@/lib/validations';

// =============================================================================
// LIBRARY BOOKS
// =============================================================================

export async function getBooks(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (params?.category) where.category = params.category;
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search } },
        { author: { contains: params.search } },
        { isbn: { contains: params.search } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.libraryBook.findMany({
        where,
        include: { _count: { select: { loans: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.libraryBook.count({ where }),
    ]);

    return {
      success: true,
      data: books,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBook(data: {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  category?: string;
  language?: string;
  totalCopies?: number;
  shelfNumber?: string;
  description?: string;
}): Promise<ActionResponse> {
  try {
    const book = await prisma.libraryBook.create({
      data: {
        ...data,
        availableCopies: data.totalCopies || 1,
      },
    });
    revalidatePath('/library');
    return { success: true, data: book };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkoutBook(data: {
  bookId: string;
  studentId: string;
  dueDate: string;
}): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const book = await prisma.libraryBook.findUnique({ where: { id: data.bookId } });
    if (!book) return { success: false, error: 'الكتاب غير موجود' };
    if (book.availableCopies <= 0) return { success: false, error: 'لا توجد نسخ متاحة' };

    await prisma.$transaction(async (tx) => {
      await tx.bookLoan.create({
        data: {
          bookId: data.bookId,
          studentId: data.studentId,
          dueDate: new Date(data.dueDate),
          issuedBy: user.id,
        },
      });

      await tx.libraryBook.update({
        where: { id: data.bookId },
        data: { availableCopies: { decrement: 1 } },
      });
    });

    revalidatePath('/library');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function returnBook(loanId: string): Promise<ActionResponse> {
  try {
    const loan = await prisma.bookLoan.findUnique({ where: { id: loanId } });
    if (!loan) return { success: false, error: 'سجل الاستعارة غير موجود' };

    const isOverdue = new Date() > loan.dueDate;
    const daysOverdue = isOverdue
      ? Math.ceil((Date.now() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const fine = daysOverdue * 2; // 2 SAR per day

    await prisma.$transaction(async (tx) => {
      await tx.bookLoan.update({
        where: { id: loanId },
        data: {
          returnDate: new Date(),
          status: 'RETURNED',
          fine,
        },
      });

      await tx.libraryBook.update({
        where: { id: loan.bookId },
        data: { availableCopies: { increment: 1 } },
      });
    });

    revalidatePath('/library');
    return { success: true, data: { fine, daysOverdue } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOverdueBooks(): Promise<ActionResponse> {
  try {
    const loans = await prisma.bookLoan.findMany({
      where: {
        status: 'ACTIVE',
        dueDate: { lt: new Date() },
      },
      include: {
        book: true,
        student: { include: { user: { select: { name: true } } } },
      },
      orderBy: { dueDate: 'asc' },
    });
    return { success: true, data: loans };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLibraryStats(): Promise<ActionResponse> {
  try {
    const [totalBooks, totalCopies, activeLoans, overdueLoans] = await Promise.all([
      prisma.libraryBook.count({ where: { deletedAt: null } }),
      prisma.libraryBook.aggregate({ _sum: { totalCopies: true }, where: { deletedAt: null } }),
      prisma.bookLoan.count({ where: { status: 'ACTIVE' } }),
      prisma.bookLoan.count({ where: { status: 'ACTIVE', dueDate: { lt: new Date() } } }),
    ]);
    return {
      success: true,
      data: {
        totalBooks,
        totalCopies: totalCopies._sum.totalCopies || 0,
        activeLoans,
        overdueLoans,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// TRANSPORT
// =============================================================================

export async function getRoutes(): Promise<ActionResponse> {
  try {
    const routes = await prisma.transportRoute.findMany({
      include: {
        vehicle: true,
        _count: { select: { assignments: true } },
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: routes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getVehicles(): Promise<ActionResponse> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { _count: { select: { routes: true } } },
    });
    return { success: true, data: vehicles };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createVehicle(data: {
  plateNumber: string;
  type?: string;
  capacity?: number;
  driverName?: string;
  driverPhone?: string;
}): Promise<ActionResponse> {
  try {
    const vehicle = await prisma.vehicle.create({ data });
    revalidatePath('/transport');
    return { success: true, data: vehicle };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRoute(data: {
  name: string;
  description?: string;
  vehicleId?: string;
  startTime?: string;
  endTime?: string;
  monthlyFee?: number;
}): Promise<ActionResponse> {
  try {
    const route = await prisma.transportRoute.create({ data });
    revalidatePath('/transport');
    return { success: true, data: route };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignStudentToRoute(data: {
  studentId: string;
  routeId: string;
  pickupPoint?: string;
}): Promise<ActionResponse> {
  try {
    const assignment = await prisma.transportAssignment.upsert({
      where: { studentId: data.studentId },
      create: data,
      update: { routeId: data.routeId, pickupPoint: data.pickupPoint },
    });
    revalidatePath('/transport');
    return { success: true, data: assignment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// PROCUREMENT
// =============================================================================

export async function getPurchaseOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const where: any = {};
    if (params?.status) where.status = params.status;

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: { supplier: true, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return {
      success: true,
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInventoryItems(params?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (params?.category) where.category = params.category;
    if (params?.status) where.status = params.status;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { sku: { contains: params.search } },
      ];
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// ASSETS
// =============================================================================

export async function getAssets(params?: {
  category?: string;
  condition?: string;
  search?: string;
}): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (params?.category) where.category = params.category;
    if (params?.condition) where.condition = params.condition;
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { assetNumber: { contains: params.search } },
      ];
    }

    const assets = await prisma.asset.findMany({
      where,
      include: { _count: { select: { maintenanceRequests: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: assets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMaintenanceRequests(params?: {
  status?: string;
  priority?: string;
}): Promise<ActionResponse> {
  try {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.priority) where.priority = params.priority;

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: requests };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// SETTINGS
// =============================================================================

export async function getSchoolInfo(): Promise<ActionResponse> {
  try {
    let info = await prisma.schoolInfo.findFirst();
    if (!info) {
      info = await prisma.schoolInfo.create({ data: {} });
    }
    return { success: true, data: info };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSchoolInfo(data: Record<string, any>): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    let info = await prisma.schoolInfo.findFirst();
    if (info) {
      info = await prisma.schoolInfo.update({
        where: { id: info.id },
        data,
      });
    } else {
      info = await prisma.schoolInfo.create({ data });
    }

    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      resource: 'SchoolInfo',
      newData: data,
    });

    revalidatePath('/settings');
    return { success: true, data: info };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export async function getNotifications(userId: string): Promise<ActionResponse> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { success: true, data: { notifications, unreadCount } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationRead(id: string): Promise<ActionResponse> {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// AUDIT LOG
// =============================================================================

export async function getAuditLogs(params?: {
  page?: number;
  limit?: number;
  resource?: string;
  action?: string;
  userId?: string;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const where: any = {};
    if (params?.resource) where.resource = params.resource;
    if (params?.action) where.action = params.action;
    if (params?.userId) where.userId = params.userId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { name: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      success: true,
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export async function getDashboardStats(): Promise<ActionResponse> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalStudents,
      activeStudents,
      totalEmployees,
      activeEmployees,
      todayPresent,
      todayAbsent,
      todayLate,
      monthlyRevenue,
      pendingInvoices,
      overdueInvoices,
      pendingLeaves,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.student.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.employee.count({ where: { deletedAt: null } }),
      prisma.employee.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.studentAttendance.count({ where: { date: { gte: startOfDay }, status: 'PRESENT' } }),
      prisma.studentAttendance.count({ where: { date: { gte: startOfDay }, status: 'ABSENT' } }),
      prisma.studentAttendance.count({ where: { date: { gte: startOfDay }, status: 'LATE' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: startOfMonth }, status: 'COMPLETED' },
      }),
      prisma.invoice.count({ where: { status: { in: ['UNPAID', 'PARTIAL'] } } }),
      prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
    ]);

    const attendanceRate = (todayPresent + todayAbsent + todayLate) > 0
      ? ((todayPresent + todayLate) / (todayPresent + todayAbsent + todayLate) * 100).toFixed(1)
      : '0';

    return {
      success: true,
      data: {
        students: { total: totalStudents, active: activeStudents },
        employees: { total: totalEmployees, active: activeEmployees },
        attendance: { present: todayPresent, absent: todayAbsent, late: todayLate, rate: attendanceRate },
        finance: {
          monthlyRevenue: monthlyRevenue._sum.amount || 0,
          pendingInvoices,
          overdueInvoices,
        },
        pendingLeaves,
        recentActivity: recentAuditLogs,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

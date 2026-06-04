'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser, createAuditLog, generateInvoiceNumber, generatePaymentNumber } from '@/lib/auth';
import { createInvoiceSchema, recordPaymentSchema, type ActionResponse } from '@/lib/validations';

// =============================================================================
// CREATE INVOICE
// =============================================================================

export async function createInvoice(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = createInvoiceSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const invoiceNumber = await generateInvoiceNumber();
    const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        studentId: data.studentId,
        totalAmount,
        balance: totalAmount,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
        issuedBy: user.id,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            amount: item.amount,
            feeStructureId: item.feeStructureId,
          })),
        },
      },
      include: { items: true },
    });

    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      resource: 'Invoice',
      resourceId: invoice.id,
      newData: { invoiceNumber, totalAmount, studentId: data.studentId },
    });

    revalidatePath('/finance');
    return { success: true, data: invoice };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ في إنشاء الفاتورة' };
  }
}

// =============================================================================
// RECORD PAYMENT
// =============================================================================

export async function recordPayment(formData: unknown): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const parsed = recordPaymentSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;
    const paymentNumber = await generatePaymentNumber();

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
    });

    if (!invoice) {
      return { success: false, error: 'الفاتورة غير موجودة' };
    }

    if (data.amount > invoice.balance) {
      return { success: false, error: 'المبلغ المدفوع يتجاوز الرصيد المتبقي' };
    }

    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          paymentNumber,
          invoiceId: data.invoiceId,
          amount: data.amount,
          method: data.method,
          referenceNumber: data.referenceNumber,
          receivedBy: user.id,
          notes: data.notes,
        },
      });

      const newPaidAmount = invoice.paidAmount + data.amount;
      const newBalance = invoice.totalAmount - newPaidAmount;
      const newStatus = newBalance <= 0 ? 'PAID' : 'PARTIAL';

      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus,
        },
      });

      return newPayment;
    });

    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      resource: 'Payment',
      resourceId: payment.id,
      newData: { paymentNumber, amount: data.amount, invoiceId: data.invoiceId },
    });

    revalidatePath('/finance');
    return { success: true, data: payment };
  } catch (error: any) {
    return { success: false, error: error.message || 'حدث خطأ في تسجيل الدفعة' };
  }
}

// =============================================================================
// GET INVOICES
// =============================================================================

export async function getInvoices(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  studentId?: string;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.studentId) where.studentId = params.studentId;
    if (params?.search) {
      where.OR = [
        { invoiceNumber: { contains: params.search } },
        { student: { user: { name: { contains: params.search } } } },
        { student: { studentNumber: { contains: params.search } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          student: {
            include: { user: { select: { name: true } } },
          },
          items: true,
          payments: { orderBy: { paidAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      success: true,
      data: invoices,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// FINANCE DASHBOARD
// =============================================================================

export async function getFinanceDashboard(): Promise<ActionResponse> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalInvoices,
      totalCollected,
      totalOutstanding,
      overdueCount,
      monthlyPayments,
      yearlyPayments,
      recentPayments,
      statusCounts,
    ] = await Promise.all([
      prisma.invoice.aggregate({ _sum: { totalAmount: true } }),
      prisma.invoice.aggregate({ _sum: { paidAmount: true } }),
      prisma.invoice.aggregate({ _sum: { balance: true }, where: { status: { in: ['UNPAID', 'PARTIAL', 'OVERDUE'] } } }),
      prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: startOfMonth }, status: 'COMPLETED' } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: startOfYear }, status: 'COMPLETED' } }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { paidAt: 'desc' },
        include: {
          invoice: {
            include: { student: { include: { user: { select: { name: true } } } } },
          },
        },
      }),
      prisma.invoice.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // Monthly expenses
    const monthlyExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfMonth }, status: { in: ['APPROVED', 'PAID'] } },
    });

    return {
      success: true,
      data: {
        totalInvoiced: totalInvoices._sum.totalAmount || 0,
        totalCollected: totalCollected._sum.paidAmount || 0,
        totalOutstanding: totalOutstanding._sum.balance || 0,
        overdueCount,
        monthlyRevenue: monthlyPayments._sum.amount || 0,
        yearlyRevenue: yearlyPayments._sum.amount || 0,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        recentPayments,
        statusCounts,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// EXPENSES
// =============================================================================

export async function createExpense(data: {
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  date?: string;
  notes?: string;
}): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const expense = await prisma.expense.create({
      data: {
        category: data.category,
        description: data.description,
        amount: data.amount,
        vendor: data.vendor,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes,
      },
    });

    revalidatePath('/finance');
    return { success: true, data: expense };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExpenses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}): Promise<ActionResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.category) where.category = params.category;
    if (params?.status) where.status = params.status;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({ where, orderBy: { date: 'desc' }, skip, take: limit }),
      prisma.expense.count({ where }),
    ]);

    return {
      success: true,
      data: expenses,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// FEE STRUCTURES
// =============================================================================

export async function getFeeStructures(): Promise<ActionResponse> {
  try {
    const structures = await prisma.feeStructure.findMany({
      include: {
        academicYear: true,
        grade: { include: { stage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: structures };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createFeeStructure(data: {
  name: string;
  academicYearId: string;
  gradeId?: string;
  amount: number;
  category: string;
  isRequired?: boolean;
}): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'غير مصرح' };

    const structure = await prisma.feeStructure.create({ data });
    revalidatePath('/finance');
    return { success: true, data: structure };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

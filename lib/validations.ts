import { z } from 'zod';

// =============================================================================
// STUDENT VALIDATIONS
// =============================================================================

export const createStudentSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(100),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  nationalId: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().optional(),
  nationality: z.string().default('سعودي'),
  bloodType: z.string().optional(),
  medicalNotes: z.string().optional(),
  address: z.string().optional(),
  previousSchool: z.string().optional(),
  specialNeeds: z.string().optional(),
  sectionId: z.string().min(1, 'يجب اختيار الفصل'),
  guardianName: z.string().min(2, 'اسم ولي الأمر مطلوب'),
  guardianPhone: z.string().min(9, 'رقم الهاتف غير صالح'),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  guardianRelationship: z.string().default('أب'),
  guardianNationalId: z.string().optional(),
  guardianAddress: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  id: z.string(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'WITHDRAWN', 'GRADUATED', 'TRANSFERRED']).optional(),
});

// =============================================================================
// ATTENDANCE VALIDATIONS
// =============================================================================

export const markAttendanceSchema = z.object({
  sectionId: z.string().min(1),
  termId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(z.object({
    studentId: z.string(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    notes: z.string().optional(),
  })).min(1, 'يجب تسجيل حضور طالب واحد على الأقل'),
});

// =============================================================================
// FINANCE VALIDATIONS
// =============================================================================

export const createInvoiceSchema = z.object({
  studentId: z.string().min(1, 'يجب اختيار الطالب'),
  items: z.array(z.object({
    description: z.string().min(1),
    amount: z.number().positive('المبلغ يجب أن يكون موجباً'),
    feeStructureId: z.string().optional(),
  })).min(1, 'يجب إضافة بند واحد على الأقل'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

export const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'يجب اختيار الفاتورة'),
  amount: z.number().positive('المبلغ يجب أن يكون موجباً'),
  method: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'ONLINE']),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

// =============================================================================
// GRADE ENTRY VALIDATIONS
// =============================================================================

export const enterGradesSchema = z.object({
  examPeriodId: z.string().min(1),
  subjectId: z.string().min(1),
  entries: z.array(z.object({
    studentId: z.string(),
    score: z.number().min(0).max(100),
    notes: z.string().optional(),
  })).min(1),
});

// =============================================================================
// EMPLOYEE VALIDATIONS
// =============================================================================

export const createEmployeeSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  position: z.string().min(1, 'المسمى الوظيفي مطلوب'),
  departmentId: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY']),
  basicSalary: z.number().min(0),
  role: z.enum(['ADMIN', 'TEACHER', 'ACCOUNTANT', 'HR_MANAGER', 'LIBRARIAN']).default('TEACHER'),
});

export const createLeaveRequestSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['ANNUAL', 'SICK', 'MATERNITY', 'UNPAID', 'EMERGENCY', 'OTHER']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().optional(),
});

export const createContractSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  salary: z.number().positive(),
  allowances: z.number().min(0).default(0),
  notes: z.string().optional(),
});

// =============================================================================
// ACADEMIC VALIDATIONS
// =============================================================================

export const createAcademicYearSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isCurrent: z.boolean().default(false),
});

export const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  gradeId: z.string().min(1),
  departmentId: z.string().optional(),
  weeklyPeriods: z.number().min(1).default(4),
  maxScore: z.number().default(100),
  passScore: z.number().default(50),
});

// =============================================================================
// LIBRARY VALIDATIONS
// =============================================================================

export const createBookSchema = z.object({
  title: z.string().min(1, 'عنوان الكتاب مطلوب'),
  author: z.string().min(1, 'اسم المؤلف مطلوب'),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  category: z.string().default('عام'),
  language: z.string().default('عربي'),
  totalCopies: z.number().min(1).default(1),
  shelfNumber: z.string().optional(),
  description: z.string().optional(),
});

export const checkoutBookSchema = z.object({
  bookId: z.string().min(1),
  studentId: z.string().min(1),
  dueDate: z.string().min(1),
});

// =============================================================================
// TRANSPORT VALIDATIONS
// =============================================================================

export const createRouteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  vehicleId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  monthlyFee: z.number().min(0).default(0),
});

// =============================================================================
// SETTINGS VALIDATIONS
// =============================================================================

export const updateSchoolInfoSchema = z.object({
  nameAr: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().optional(),
  taxNumber: z.string().optional(),
  currency: z.string().optional(),
  currencySymbol: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  weekStart: z.string().optional(),
});

// =============================================================================
// AUTH VALIDATIONS
// =============================================================================

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

// =============================================================================
// COMMON TYPES
// =============================================================================

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

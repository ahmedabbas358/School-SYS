'use server';

import { revalidatePath } from 'next/cache';

// -------------------------------------------------------------
// إدارة الطلاب (Students) - Mocked Data
// -------------------------------------------------------------
export async function getStudents() {
  return [
    { id: '1', firstName: 'أحمد', lastName: 'الماجد', nationalId: '1092837465', gradeLevel: 'الصف السادس', status: 'ACTIVE' },
    { id: '2', firstName: 'سارة', lastName: 'فهد', nationalId: '1092837466', gradeLevel: 'الاول الثانوي', status: 'ACTIVE' }
  ];
}

export async function addStudent(data: any) {
  console.log('Mock: Student added', data);
  revalidatePath('/academic');
  return { success: true, student: { id: Date.now().toString(), ...data } };
}

// -------------------------------------------------------------
// الإدارة المالية (Finance) - Mocked Data
// -------------------------------------------------------------
export async function getPayments() {
  return [
    { id: '1', studentId: '1', amount: 500, method: 'CREDIT', status: 'COMPLETED' },
    { id: '2', studentId: '2', amount: 300, method: 'BANK_TRANSFER', status: 'PENDING' }
  ];
}

export async function registerPayment(data: any) {
  console.log('Mock: Payment registered', data);
  revalidatePath('/finance');
  return { success: true, payment: { id: Date.now().toString(), status: 'COMPLETED', ...data } };
}

// -------------------------------------------------------------
// الموارد البشرية (HR - Teachers) - Mocked Data
// -------------------------------------------------------------
export async function getTeachers() {
  return [
    { id: '1', firstName: 'محمد', lastName: 'عبدالله', subject: 'رياضيات', qualification: 'بكالوريوس', salary: 5000, status: 'ACTIVE' },
    { id: '2', firstName: 'نورة', lastName: 'الخالد', subject: 'لغة عربية', qualification: 'ماجستير', salary: 6000, status: 'ACTIVE' }
  ];
}

export async function addTeacher(data: any) {
  console.log('Mock: Teacher added', data);
  revalidatePath('/hr');
  return { success: true, teacher: { id: Date.now().toString(), status: 'ACTIVE', ...data } };
}

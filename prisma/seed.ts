import { PrismaClient } from '@prisma/client';
import { fakerAR as faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB seed...');

  // Clean DB (order matters to avoid foreign key constraints)
  console.log('Cleaning up existing data...');
  await prisma.transportAssignment.deleteMany();
  await prisma.transportRoute.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.feeStructure.deleteMany();
  
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.payrollEntry.deleteMany();
  await prisma.staffAttendance.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.teacherSubject.deleteMany();
  
  await prisma.studentAttendance.deleteMany();
  await prisma.behaviorRecord.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.studentGuardian.deleteMany();
  await prisma.student.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  
  await prisma.timetableSlot.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.department.deleteMany();
  await prisma.section.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.term.deleteMany();
  await prisma.academicYear.deleteMany();
  
  await prisma.schoolInfo.deleteMany();
  await prisma.systemSetting.deleteMany();

  // 1. School Info
  console.log('Creating School Info...');
  await prisma.schoolInfo.create({
    data: {
      nameAr: 'مدارس المستقبل الأهلية',
      nameEn: 'Future Schools Intl.',
      address: 'الرياض، المملكة العربية السعودية',
      phone: '0500000000',
      email: 'info@futureschools.edu.sa',
      currency: 'SAR',
      currencySymbol: 'ر.س',
    }
  });

  // 2. Academic Structure
  console.log('Creating Academic Structure...');
  const currentYear = await prisma.academicYear.create({
    data: {
      name: '2026/2027',
      startDate: new Date('2026-08-20'),
      endDate: new Date('2027-06-15'),
      isCurrent: true,
    }
  });

  const term1 = await prisma.term.create({
    data: {
      name: 'الفصل الأول',
      academicYearId: currentYear.id,
      startDate: new Date('2026-08-20'),
      endDate: new Date('2026-12-30'),
      isCurrent: true,
    }
  });

  const primaryStage = await prisma.stage.create({ data: { name: 'المرحلة الابتدائية', order: 1 } });
  const middleStage = await prisma.stage.create({ data: { name: 'المرحلة المتوسطة', order: 2 } });
  
  const grade1 = await prisma.grade.create({ data: { name: 'الصف الأول الابتدائي', stageId: primaryStage.id, order: 1 } });
  const grade2 = await prisma.grade.create({ data: { name: 'الصف الثاني الابتدائي', stageId: primaryStage.id, order: 2 } });
  const grade7 = await prisma.grade.create({ data: { name: 'الصف الأول المتوسط', stageId: middleStage.id, order: 7 } });

  const section1A = await prisma.section.create({ data: { name: 'أ', gradeId: grade1.id, capacity: 25 } });
  const section1B = await prisma.section.create({ data: { name: 'ب', gradeId: grade1.id, capacity: 25 } });
  const section7A = await prisma.section.create({ data: { name: 'أ', gradeId: grade7.id, capacity: 25 } });

  const deptMath = await prisma.department.create({ data: { name: 'الرياضيات والعلوم' } });
  const deptLang = await prisma.department.create({ data: { name: 'اللغات والتربية' } });

  const subjMath = await prisma.subject.create({ data: { name: 'الرياضيات', code: 'MATH-101', gradeId: grade1.id, departmentId: deptMath.id, weeklyPeriods: 5 } });
  const subjArabic = await prisma.subject.create({ data: { name: 'لغتي', code: 'ARAB-101', gradeId: grade1.id, departmentId: deptLang.id, weeklyPeriods: 6 } });

  // 3. Admin User
  console.log('Creating Users and Employees...');
  const defaultPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@school.com',
      password: defaultPassword,
      name: 'مدير النظام',
      role: 'SUPER_ADMIN',
    }
  });

  // 4. Employees & Teachers
  const teacherUsers = [];
  const teacherEmployees = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `teacher${i+1}@school.com`,
        password: defaultPassword,
        name: faker.person.fullName({ sex: i % 2 === 0 ? 'male' : 'female' }),
        role: 'TEACHER',
      }
    });
    teacherUsers.push(user);
    
    const emp = await prisma.employee.create({
      data: {
        userId: user.id,
        employeeNumber: `EMP-T-00${i+1}`,
        position: 'معلم',
        departmentId: i % 2 === 0 ? deptMath.id : deptLang.id,
        basicSalary: faker.number.int({ min: 6000, max: 12000 }),
        joinDate: new Date('2023-08-15'),
      }
    });
    teacherEmployees.push(emp);

    await prisma.teacherSubject.create({
      data: {
        employeeId: emp.id,
        subjectId: i % 2 === 0 ? subjMath.id : subjArabic.id,
      }
    });
    
    // Contracts
    await prisma.contract.create({
      data: {
        contractNumber: `CTR-${emp.employeeNumber}`,
        employeeId: emp.id,
        startDate: new Date('2023-08-15'),
        salary: emp.basicSalary,
      }
    });
  }

  // 5. Students & Guardians
  console.log('Creating Students and Guardians...');
  const students = [];
  
  for (let i = 0; i < 20; i++) {
    // Guardian
    const guardianUser = await prisma.user.create({
      data: {
        email: `parent${i+1}@school.com`,
        password: defaultPassword,
        name: faker.person.fullName({ sex: 'male' }),
        role: 'PARENT',
      }
    });

    const guardian = await prisma.guardian.create({
      data: {
        userId: guardianUser.id,
        phone: faker.phone.number(),
        relationship: 'أب',
      }
    });

    // Student
    const studentUser = await prisma.user.create({
      data: {
        email: `student${i+1}@school.com`,
        password: defaultPassword,
        name: faker.person.fullName({ sex: i % 2 === 0 ? 'male' : 'female' }),
        role: 'STUDENT',
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        studentNumber: `STU-26-00${i+1}`,
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        dateOfBirth: faker.date.birthdate({ min: 6, max: 12, mode: 'age' }),
      }
    });
    students.push(student);

    await prisma.studentGuardian.create({
      data: {
        studentId: student.id,
        guardianId: guardian.id,
        isPrimary: true,
      }
    });

    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        academicYearId: currentYear.id,
        sectionId: i < 10 ? section1A.id : section1B.id,
      }
    });
  }

  // 6. Transport
  console.log('Creating Transport Data...');
  const bus1 = await prisma.vehicle.create({
    data: { plateNumber: '1234 ABC', type: 'BUS', capacity: 30, driverName: 'أحمد السائق', status: 'ACTIVE' }
  });
  
  const route1 = await prisma.transportRoute.create({
    data: { name: 'مسار حي الياسمين', vehicleId: bus1.id, startTime: '06:30', endTime: '07:15', monthlyFee: 300 }
  });

  // Assign first 10 students to transport
  for (let i = 0; i < 10; i++) {
    await prisma.transportAssignment.create({
      data: {
        studentId: students[i].id,
        routeId: route1.id,
        pickupPoint: `نقطة ${i+1}`,
      }
    });
  }

  // 7. Finance
  console.log('Creating Finance Data...');
  const tuitionFee = await prisma.feeStructure.create({
    data: { name: 'رسوم دراسية', academicYearId: currentYear.id, gradeId: grade1.id, amount: 15000, category: 'TUITION' }
  });

  for (let i = 0; i < 5; i++) {
    const inv = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-26-${i+1}`,
        studentId: students[i].id,
        totalAmount: 15000,
        paidAmount: i === 0 ? 15000 : 5000,
        balance: i === 0 ? 0 : 10000,
        status: i === 0 ? 'PAID' : 'PARTIAL',
        dueDate: new Date('2026-09-01'),
      }
    });

    await prisma.invoiceItem.create({
      data: { invoiceId: inv.id, feeStructureId: tuitionFee.id, description: 'رسوم القسط الأول', amount: 15000 }
    });

    if (i === 0) {
      await prisma.payment.create({
        data: { paymentNumber: `PAY-26-${i+1}`, invoiceId: inv.id, amount: 15000, method: 'BANK_TRANSFER' }
      });
    }
  }

  await prisma.expense.create({
    data: { category: 'UTILITIES', description: 'فاتورة الكهرباء', amount: 2500, status: 'PAID' }
  });

  // 8. Attendance & Behavior
  console.log('Creating Attendance Data...');
  const today = new Date();
  today.setHours(0,0,0,0);
  
  for (let i = 0; i < 5; i++) {
    await prisma.studentAttendance.create({
      data: {
        studentId: students[i].id,
        sectionId: section1A.id,
        termId: term1.id,
        date: today,
        status: i === 0 ? 'ABSENT' : i === 1 ? 'LATE' : 'PRESENT',
      }
    });
  }

  await prisma.behaviorRecord.create({
    data: {
      studentId: students[0].id,
      type: 'POSITIVE',
      category: 'مشاركة صفية',
      points: 10,
      recordedBy: teacherEmployees[0].id,
    }
  });

  await prisma.behaviorRecord.create({
    data: {
      studentId: students[1].id,
      type: 'WARNING',
      category: 'تأخير متكرر',
      points: -5,
    }
  });

  console.log('✅ DB seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

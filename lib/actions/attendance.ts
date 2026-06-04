'use server';

import prisma from '@/lib/prisma';

export async function getAttendanceDashboard() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [attendances, behaviors] = await Promise.all([
      prisma.studentAttendance.findMany({
        where: {
          date: {
            gte: today
          }
        },
        include: {
          student: { include: { user: true } },
          section: { include: { grade: true } }
        }
      }),
      prisma.behaviorRecord.findMany({
        include: {
          student: { include: { user: true } }
        },
        orderBy: {
          date: 'desc'
        },
        take: 50
      })
    ]);

    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendances.filter(a => a.status === 'LATE').length;
    
    // Split behaviors
    const positiveBehaviors = behaviors.filter(b => b.type === 'POSITIVE');
    const negativeBehaviors = behaviors.filter(b => b.type !== 'POSITIVE');

    return {
      success: true,
      data: {
        stats: {
          totalRecorded: attendances.length,
          presentCount,
          absentCount,
          lateCount,
          negativeCount: negativeBehaviors.length
        },
        attendances,
        positiveBehaviors,
        negativeBehaviors
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

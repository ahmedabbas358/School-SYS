'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getTransportDashboard() {
  try {
    const [vehicles, routes, assignments] = await Promise.all([
      prisma.vehicle.findMany({ include: { routes: true } }),
      prisma.transportRoute.findMany({ include: { vehicle: true, assignments: true } }),
      prisma.transportAssignment.findMany({ include: { student: { include: { user: true } }, route: true } })
    ]);

    const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE').length;
    const totalVehicles = vehicles.length;
    const totalAssignedStudents = assignments.length;
    
    return {
      success: true,
      data: {
        stats: {
          activeVehicles,
          totalVehicles,
          totalAssignedStudents,
          routesCount: routes.length
        },
        vehicles,
        routes,
        assignments
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

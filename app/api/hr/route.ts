import { NextResponse } from 'next/server';
import { getEmployees, getHRStats, getLeaveRequests } from '@/lib/actions/hr';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    
    const [employeesRes, statsRes, leavesRes] = await Promise.all([
      getEmployees(departmentId ? { departmentId } : undefined),
      getHRStats(),
      getLeaveRequests()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        employees: employeesRes.success ? employeesRes.data : [],
        stats: statsRes.success ? statsRes.data : {},
        leaves: leavesRes.success ? leavesRes.data : []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ success: false, error: 'Not implemented' }, { status: 501 });
}

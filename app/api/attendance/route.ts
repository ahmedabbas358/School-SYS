import { NextResponse } from 'next/server';
import { getAttendanceDashboard } from '@/lib/actions/attendance';

export async function GET(request: Request) {
  try {
    const result = await getAttendanceDashboard();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/actions/dashboard';

export async function GET(request: Request) {
  try {
    const result = await getDashboardData();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

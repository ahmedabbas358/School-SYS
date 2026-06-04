import { NextResponse } from 'next/server';
import { getTransportDashboard } from '@/lib/actions/transport';

export async function GET(request: Request) {
  try {
    const result = await getTransportDashboard();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

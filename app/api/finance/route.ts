import { NextResponse } from 'next/server';
import { getInvoices, recordPayment, getFinanceDashboard } from '@/lib/actions/finance';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    
    const [invoicesRes, dashboardRes] = await Promise.all([
      getInvoices({
        studentId: studentId || undefined,
        status: status || undefined,
        search: search || undefined,
        page,
        limit,
      }),
      getFinanceDashboard()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        invoices: invoicesRes.success ? invoicesRes.data : [],
        dashboard: dashboardRes.success ? dashboardRes.data : {}
      },
      meta: invoicesRes.success ? invoicesRes.meta : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (data.action === 'RECORD_PAYMENT') {
       const result = await recordPayment(data.payload);
       return NextResponse.json(result);
    }
    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getExamPeriods, getExamStats, getGradingScales } from '@/lib/actions/exams';
import { getStudents } from '@/lib/actions/students';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const [periodsRes, statsRes, scalesRes, studentsRes] = await Promise.all([
      getExamPeriods(),
      getExamStats(),
      getGradingScales(),
      getStudents({ limit: 10 }) // Get some students for the progression/results entry mock
    ]);

    return NextResponse.json({
      success: true,
      data: {
        periods: periodsRes.success ? periodsRes.data : [],
        stats: statsRes.success ? statsRes.data : {},
        scales: scalesRes.success ? scalesRes.data : [],
        students: studentsRes.success ? studentsRes.data.students : []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

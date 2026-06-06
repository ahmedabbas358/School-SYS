import { NextResponse } from 'next/server';
import { getAcademicStructure, getSubjects, getAcademicYears } from '@/lib/actions/academic';

export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const [structureRes, subjectsRes, yearsRes] = await Promise.all([
       getAcademicStructure(),
       getSubjects(),
       getAcademicYears()
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
         structure: structureRes.success ? structureRes.data : [],
         subjects: subjectsRes.success ? subjectsRes.data : [],
         years: yearsRes.success ? yearsRes.data : []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

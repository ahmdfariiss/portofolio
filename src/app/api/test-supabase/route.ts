import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*');

    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .single();

    const { data: highlights, error: highlightsError } = await supabase
      .from('highlights')
      .select('*');

    return NextResponse.json({
      success: true,
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      },
      skills: { data: skills, error: skillsError?.message },
      profile: { data: profile, error: profileError?.message },
      highlights: { data: highlights, error: highlightsError?.message },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}

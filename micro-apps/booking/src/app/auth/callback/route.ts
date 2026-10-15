import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Magic-link callback: exchanges the one-time code for a session cookie,
 * then sends the user on to where they were heading.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/account/profile';
  const safeNext = next.startsWith('/') ? next : '/account/profile';

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value, ...(options as object) });
          },
          remove(name: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value: '', ...(options as object) });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Something went wrong — send them back to sign in with a hint.
  return NextResponse.redirect(`${origin}/auth/login?error=link_expired`);
}

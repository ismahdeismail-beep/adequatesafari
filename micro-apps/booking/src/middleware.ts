import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase session cookie and guards private routes.
 * No tokens are stored in localStorage — the session lives in httpOnly cookies.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response; // unconfigured → sample-data mode, no guarding

  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...(options as object) });
      },
      remove(name: string, options: Record<string, unknown>) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: '', ...(options as object) });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith('/account') || path.startsWith('/admin') || path === '/booking/my-bookings';

  if (!user && isProtected) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/auth/login';
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/booking/my-bookings'],
};

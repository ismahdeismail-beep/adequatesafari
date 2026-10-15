import { redirect } from 'next/navigation';

/** Magic-link sign-in now lives on /auth/login — keep this path working. */
export default function OtpRedirectPage() {
  redirect('/auth/login');
}

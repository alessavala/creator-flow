// Preserve only internal campaign-invitation routes after authentication.
// Do not accept arbitrary redirect URLs or paths containing unsafe segments.
export function redirectAfterAuth(next: string | null | undefined): string {
  if (next && /^\/contratar\/[a-zA-Z0-9_-]+$/.test(next)) return next;
  return "/creators";
}

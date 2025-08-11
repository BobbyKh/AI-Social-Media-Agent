'use server'

export async function callApi(path: string, opts?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...(opts?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function createCheckoutSession(planId: string, successUrl: string, cancelUrl: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const access = cookieStore.get('access')?.value;
  
  if (!access) {
    throw new Error('Authentication required');
  }
  
  const res = await fetch(`${base}/api/auth/create-checkout-session/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    }),
    cache: 'no-store',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }
  
  return res.json();
}

export async function login(username: string, password: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
  const res = await fetch(`${base}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  const body = await res.json();
  const { cookies } = await import('next/headers');
  const c = await cookies();
  c.set('access', body.access, { httpOnly: true, sameSite: 'lax', path: '/' });
  c.set('refresh', body.refresh, { httpOnly: true, sameSite: 'lax', path: '/' });
  return true;
}

export async function logout() {
  const { cookies } = await import('next/headers');
  const c = await cookies();
  c.delete('access');
  c.delete('refresh');
}


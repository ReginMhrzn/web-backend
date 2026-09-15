import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readUsers, writeUsers } from '@/lib/users';

export async function POST() {
  const cookieStore = await cookies();
  const id = cookieStore.get('session')?.value;

  if (!id) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 });
  }

  const users = readUsers();
  const filtered = users.filter((u) => u.id !== id);

  if (filtered.length === users.length) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  writeUsers(filtered);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', '', { path: '/', maxAge: 0 });
  return res;
}
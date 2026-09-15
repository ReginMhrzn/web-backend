import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserById } from '@/lib/users';

export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get('session')?.value;
  if (!id) return NextResponse.json({ user: null }, { status: 200 });

  const user = findUserById(id);
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
}
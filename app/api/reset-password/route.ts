import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { findUserByEmail, readUsers, writeUsers } from '@/lib/users';

// Step 1: request a reset token
export async function POST(req: Request) {
  const { action, email, token, newPassword } = await req.json();

  if (action === 'request') {
    const user = findUserByEmail(email);
    // Always return ok to avoid leaking which emails exist
    if (user) {
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      const resetToken = randomUUID();
      users[idx].resetToken = resetToken;
      users[idx].resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min
      writeUsers(users);
      // In a real app you'd email this. For demo we return it.
      return NextResponse.json({
        ok: true,
        // ⚠️ DEMO ONLY — remove in production!
        demoToken: resetToken,
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === 'confirm') {
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required.' },
        { status: 400 }
      );
    }
    const users = readUsers();
    const idx = users.findIndex((u) => u.resetToken === token);
    if (idx === -1) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 400 });
    }
    if (
      !users[idx].resetTokenExpiry ||
      users[idx].resetTokenExpiry! < Date.now()
    ) {
      return NextResponse.json({ error: 'Token expired.' }, { status: 400 });
    }
    users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
    users[idx].resetToken = null;
    users[idx].resetTokenExpiry = null;
    writeUsers(users);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
}
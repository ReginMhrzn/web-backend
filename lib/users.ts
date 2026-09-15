import fs from 'fs';
import path from 'path';

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  createdAt: string;
};

// Locally: project folder. On Vercel: /tmp is the only writable location.
const DATA_DIR =
  process.env.VERCEL === '1'
    ? '/tmp'
    : path.join(process.cwd(), 'CLIENTS DATA');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
  }
}

export function readUsers(): StoredUser[] {
  ensureFile();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.users) ? parsed.users : [];
  } catch {
    return [];
  }
}

export function writeUsers(users: StoredUser[]) {
  ensureFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
}

export function findUserByEmail(email: string) {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id: string) {
  return readUsers().find((u) => u.id === id);
}
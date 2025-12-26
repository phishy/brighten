import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/lib/pocketbase';

export const dynamic = 'force-dynamic';

function decodeJWT(token: string): { id?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

export async function GET() {
  const debug: Record<string, unknown> = {};
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    debug.hasToken = !!token;
    debug.tokenPreview = token ? token.substring(0, 50) + '...' : null;
    
    if (token) {
      const payload = decodeJWT(token);
      debug.payload = payload;
      debug.isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : 'no exp';
      
      if (payload?.id) {
        try {
          const user = await users.getById(payload.id);
          debug.userFound = true;
          debug.userEmail = user.email;
        } catch (err) {
          debug.userFound = false;
          debug.userError = err instanceof Error ? err.message : String(err);
        }
      }
    }
    
    debug.envCheck = {
      hasPocketBaseUrl: !!process.env.POCKETBASE_URL,
      hasAdminEmail: !!process.env.POCKETBASE_ADMIN_EMAIL,
      hasAdminPassword: !!process.env.POCKETBASE_ADMIN_PASSWORD,
    };
    
  } catch (err) {
    debug.error = err instanceof Error ? err.message : String(err);
  }
  
  return NextResponse.json(debug);
}

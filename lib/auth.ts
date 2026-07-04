import { SignJWT, jwtVerify } from "jose"

const rawSecret = process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET
const secret = rawSecret ? new TextEncoder().encode(rawSecret) : null

export interface AdminSession {
  email: string
  role: "admin"
}

export async function signIn(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<{ token: string; expiresAt: Date } | { error: string }> {
  if (!secret) {
    return {
      error:
        "Authentication secret is not configured. Set BETTER_AUTH_SECRET or AUTH_SECRET in your environment.",
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    return { error: "Admin credentials are not configured." }
  }

  if (email !== adminEmail || password !== adminPassword) {
    return { error: "Invalid email or password." }
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7))

  const token = await new SignJWT({ email: adminEmail, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt.getTime())
    .sign(secret)

  return { token, expiresAt }
}

export async function verifySession(
  token: string
): Promise<AdminSession | null> {
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    if (
      typeof payload.email === "string" &&
      payload.role === "admin"
    ) {
      return { email: payload.email, role: "admin" }
    }
    return null
  } catch {
    return null
  }
}

export const SESSION_COOKIE = "admin-session"

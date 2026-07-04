import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "admin-session"

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return false

    const [headerB64, payloadB64, signatureB64] = parts

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    )

    const valid = await crypto.subtle.verify("HMAC", key, signature, data)
    if (!valid) return false

    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    )

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false
    }

    return payload.role === "admin"
  } catch {
    return false
  }
}

function getSecret(): string {
  return process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET ?? ""
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secret = getSecret()

  if (!secret) {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next()
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (token && (await verifyToken(token, secret))) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    const response = NextResponse.next()
    response.headers.set("x-admin-route", "1")
    return response
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    if (!(await verifyToken(token, secret))) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      )
      response.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" })
      return response
    }

    const response = NextResponse.next()
    response.headers.set("x-admin-route", "1")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

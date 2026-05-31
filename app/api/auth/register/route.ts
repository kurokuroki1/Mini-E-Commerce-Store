import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/src/auth/auth.service'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password)
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

  if (password.length < 8)
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

  try {
    const user = await registerUser(email, password)
    return NextResponse.json(user, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Email already in use')
      return NextResponse.json({ error: err.message }, { status: 409 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

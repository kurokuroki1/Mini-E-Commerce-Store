import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/src/auth/auth.service'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password)
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

  try {
    const user = await loginUser(email, password)
    return NextResponse.json(user, { status: 200 })
  } catch (err: any) {
    if (err.message === 'Invalid credentials')
      return NextResponse.json({ error: err.message }, { status: 401 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

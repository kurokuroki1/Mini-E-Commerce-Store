import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma/client'

const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET!

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existing) throw new Error('Email already in use')

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    },
  })

  const { password: _, ...safeUser } = user
  return safeUser
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  if (!user) throw new Error('Invalid credentials')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Invalid credentials')

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const { password: _, ...safeUser } = user
  return { user: safeUser, token }
}
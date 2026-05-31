import bcrypt from 'bcrypt'
import { prisma } from '../prisma/client'

const SALT_ROUNDS = 12

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

  // Same error regardless of whether email or password is wrong
  if (!user) throw new Error('Invalid credentials')

  // Block soft-deleted users
  if (user.deletedAt) throw new Error('Invalid credentials')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new Error('Invalid credentials')

  const { password: _, ...safeUser } = user
  return safeUser
}
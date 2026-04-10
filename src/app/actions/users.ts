'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCreators() {
  return prisma.user.findMany({
    where: { role: 'creator' },
    orderBy: { createdAt: 'desc' },
  })
}

export async function addCreator(data: { name: string, email: string, role: string }) {
  const user = await prisma.user.create({
    data: {
      ...data,
      role: 'creator',
    },
  })
  revalidatePath('/team')
  revalidatePath('/founder')
  return user
}

export async function removeCreator(id: string) {
  const user = await prisma.user.delete({
    where: { id },
  })
  revalidatePath('/team')
  revalidatePath('/founder')
  return user
}

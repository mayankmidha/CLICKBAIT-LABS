'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCreators() {
  try {
    return await prisma.user.findMany({
      where: { role: 'creator' },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Fetch Creators Error:', error);
    return [];
  }
}

export async function addCreator(data: { name: string, email: string, role: string }) {
  try {
    const user = await prisma.user.create({
      data: {
        ...data,
        role: 'creator',
      },
    })
    revalidatePath('/')
    return user
  } catch (error) {
    console.error('Add Creator Error:', error);
    return null;
  }
}

export async function removeCreator(id: string) {
  try {
    const user = await prisma.user.delete({
      where: { id },
    })
    revalidatePath('/')
    return user
  } catch (error) {
    console.error('Delete Creator Error:', error);
    return null;
  }
}

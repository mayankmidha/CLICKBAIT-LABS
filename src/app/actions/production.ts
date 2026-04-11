'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getShootDates() {
  return prisma.shootDate.findMany({
    orderBy: { date: 'asc' },
    include: {
      _count: {
        select: { scripts: true }
      }
    }
  })
}

export async function createShootDate(date: Date, notes?: string) {
  const shootDate = await prisma.shootDate.create({
    data: {
      date,
      notes,
      status: 'scheduled'
    }
  })
  revalidatePath('/shoot')
  return shootDate
}

export async function assignScriptToShoot(scriptId: string, shootDateId: string) {
  const script = await prisma.script.update({
    where: { id: scriptId },
    data: { 
      shootDateId,
      status: 'approved' // Ensure it's approved if pushed to shoot
    }
  })
  revalidatePath('/shoot')
  revalidatePath('/tech')
  revalidatePath('/finance')
  return script
}

export async function getShootDetails(id: string) {
  return prisma.shootDate.findUnique({
    where: { id },
    include: {
      scripts: true,
      expenses: true
    }
  })
}

export async function addShootExpense(data: {
  shootDateId: string
  title: string
  amount: number
  category: string
  addedBy: string
  notes?: string
}) {
  const expense = await prisma.expense.create({
    data
  })
  revalidatePath('/shoot')
  return expense
}

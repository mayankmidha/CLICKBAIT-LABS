'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getShootDates() {
  try {
    return await prisma.shootDate.findMany({
      orderBy: { date: 'desc' },
      include: {
        scripts: { select: { id: true, title: true, channel: true, duration: true, status: true } },
        expenses: true,
      },
    })
  } catch (error) {
    console.error('Fetch ShootDates Error:', error)
    return []
  }
}

export async function createShootDate(date: string, notes?: string) {
  try {
    const shootDate = await prisma.shootDate.create({
      data: {
        date: new Date(date),
        notes: notes || null,
      },
    })
    revalidatePath('/shoot')
    return shootDate
  } catch (error) {
    console.error('Create ShootDate Error:', error)
    return null
  }
}

export async function assignScriptToShootDate(scriptId: string, shootDateId: string) {
  try {
    // Check limit: max 30 scripts per shoot date
    const count = await prisma.script.count({ where: { shootDateId } })
    if (count >= 30) {
      return { error: 'Shoot date already has 30 scripts (max reached)' }
    }

    const script = await prisma.script.update({
      where: { id: scriptId },
      data: { shootDateId },
    })
    revalidatePath('/shoot')
    revalidatePath('/tech')
    revalidatePath('/finance')
    return script
  } catch (error) {
    console.error('Assign Script Error:', error)
    return null
  }
}

export async function removeScriptFromShootDate(scriptId: string) {
  try {
    const script = await prisma.script.update({
      where: { id: scriptId },
      data: { shootDateId: null },
    })
    revalidatePath('/shoot')
    return script
  } catch (error) {
    console.error('Remove Script Error:', error)
    return null
  }
}

export async function completeShootDate(id: string) {
  try {
    const shootDate = await prisma.shootDate.update({
      where: { id },
      data: { status: 'completed' },
    })
    revalidatePath('/shoot')
    return shootDate
  } catch (error) {
    console.error('Complete ShootDate Error:', error)
    return null
  }
}

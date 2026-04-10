'use server'

import prisma from '@/lib/prisma'
import { ScriptStatus, ScriptChannel } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getScripts(channel?: ScriptChannel, status?: any | 'all') {
  const where: any = {}
  if (channel) where.channel = channel
  if (status && status !== 'all') where.status = status
  else if (!status) where.status = { not: 'deleted' }

  return prisma.script.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateScriptStatus(id: string, status: any) {
  const script = await prisma.script.update({
    where: { id },
    data: { status },
  })
  revalidatePath('/')
  revalidatePath('/tech')
  revalidatePath('/finance')
  revalidatePath('/bin')
  return script
}

export async function createScript(data: {
  title: string
  channel: ScriptChannel
  content: string
  duration: string
  hook: string
}) {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  const script = await prisma.script.create({
    data: {
      ...data,
      slug,
      status: 'pending',
    },
  })
  revalidatePath('/')
  revalidatePath(`/${data.channel}`)
  return script
}

export async function getScriptBySlug(slug: string) {
  return prisma.script.findUnique({
    where: { slug },
  })
}

export async function deleteScript(id: string) {
  return updateScriptStatus(id, 'deleted')
}

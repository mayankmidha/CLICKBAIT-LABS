'use server'

import prisma from '@/lib/prisma'
import { ScriptStatus, ScriptChannel } from '@/lib/types'
import { revalidatePath } from 'next/cache'

// Fallback data if DB fails
const MOCK_SCRIPTS = [
  { id: '1', title: 'System Error: No DB Found', channel: 'tech', status: 'pending', duration: '0:00', hook: 'Connect a real database to see your scripts.', content: '# Error\nPlease configure DATABASE_URL.', createdAt: new Date() }
];

export async function getScripts(channel?: ScriptChannel, status?: any | 'all') {
  try {
    const where: any = {}
    if (channel) where.channel = channel
    if (status && status !== 'all') where.status = status
    else if (!status) where.status = { not: 'deleted' }

    return await prisma.script.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Database Error:', error);
    return []; // Return empty instead of crashing
  }
}

export async function updateScriptStatus(id: string, status: any) {
  try {
    const script = await prisma.script.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/')
    return script
  } catch (error) {
    console.error('Update Error:', error);
    return null;
  }
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

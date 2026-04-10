'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  try {
    return await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    })
  } catch (error) {
    console.error('Fetch Expenses Error:', error);
    return [];
  }
}

export async function addExpense(data: {
  title: string
  amount: number
  category: string
  addedBy: string
  notes?: string
}) {
  try {
    const expense = await prisma.expense.create({
      data,
    })
    revalidatePath('/shoot')
    revalidatePath('/founder')
    return expense
  } catch (error) {
    console.error('Add Expense Error:', error);
    return null;
  }
}

export async function removeExpense(id: string) {
  try {
    const expense = await prisma.expense.delete({
      where: { id },
    })
    revalidatePath('/shoot')
    revalidatePath('/founder')
    return expense
  } catch (error) {
    console.error('Delete Expense Error:', error);
    return null;
  }
}

import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { AuthRequest } from '../types'

const prisma = new PrismaClient()

const createRecordSchema = z.object({
  difficulty: z.string(),
  rows: z.number().int().positive(),
  cols: z.number().int().positive(),
  mines: z.number().int().positive(),
  time: z.number().int().positive(),
  seed: z.number().int(),
  won: z.boolean()
})

export const createRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createRecordSchema.parse(req.body)

    const record = await prisma.gameRecord.create({
      data: {
        ...data,
        userId: req.userId!
      }
    })

    res.status(201).json(record)
  } catch (error) {
    console.error('CreateRecord error:', error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors })
      return
    }
    res.status(500).json({ message: 'Internal server error', error: String(error) })
  }
}

export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { difficulty, limit = '10' } = req.query

    const where: any = { won: true }
    if (difficulty && difficulty !== 'Все') {
      where.difficulty = difficulty
    }

    const records = await prisma.gameRecord.findMany({
      where,
      orderBy: { time: 'asc' },
      take: parseInt(limit as string),
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    })

    const total = await prisma.gameRecord.count({ where })

    res.json({ records, total })
  } catch (error) {
    console.error('GetRecords error:', error)
    res.status(500).json({ message: 'Internal server error', error: String(error) })
  }
}

export const getUserRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { limit = '10' } = req.query

    const records = await prisma.gameRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    })

    const total = await prisma.gameRecord.count({ where: { userId } })

    res.json({ records, total })
  } catch (error) {
    console.error('GetUserRecords error:', error)
    res.status(500).json({ message: 'Internal server error', error: String(error) })
  }
}

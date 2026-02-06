import { Request } from 'express'

export interface AuthRequest extends Request {
  userId?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface GameRecordData {
  difficulty: string
  rows: number
  cols: number
  mines: number
  time: number
  seed: number
  won: boolean
}

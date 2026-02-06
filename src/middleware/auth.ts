import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { verifyToken } from '../utils/jwt'

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  req.userId = payload.userId
  next()
}

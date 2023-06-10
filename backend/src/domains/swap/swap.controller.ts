import { type Errback, type Request, type Response } from 'express'
import { getMirror, openSwap } from './swap.service'

export const open = (req: Request, res: Response, next: Errback) => {
  openSwap(req.body)
    .then((result) => res.json(result))
    .catch((err) => {
      next(err)
    })
}

export const mirror = (req: Request, res: Response, next: Errback) => {
  getMirror(req.query.swapId as string)
    .then((result) => res.json({ result }))
    .catch((err) => {
      next(err)
    })
}


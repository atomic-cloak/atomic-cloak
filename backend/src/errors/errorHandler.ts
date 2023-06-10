import { type Errback, type Request, type Response } from 'express'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: Errback
) => {
  console.error(`[error]: ${err.message}, ${err.stack}`)
  const status = err.status || 500
  res.status(status).send({ error: err.message })
}

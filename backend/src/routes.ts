import { Router } from 'express'
import { swapRouter } from './domains/swap'

const router = Router()

router.use('/swap', swapRouter)

export default router

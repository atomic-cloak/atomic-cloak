import { Router } from 'express'
import { open } from './swap.controller'

const router = Router()

router.route('/').post(open)

export default router

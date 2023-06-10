import { Router } from 'express'
import { mirror, open } from './swap.controller'

const router = Router()

router.route('/').post(open)
router.route('/mirror').get(mirror)

export default router

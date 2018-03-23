import { Router } from 'express'

import users from './users'
import category from './category'

var router = Router()

// Add USERS Routes
router.use(users)
router.use(category)

export default router

import express from 'express'
import { addWin, getWins, getWinsPages } from '../controllers/winsController'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').get(getWins).post(auth, addWin)
router.route('/pages').get(getWinsPages)

export default router

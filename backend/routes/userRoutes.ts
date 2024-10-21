import express from 'express'
import {
	addUser,
	getUsers,
	getUserScore,
	getWinsByUser,
	loginUser,
} from '../controllers/usersController'
import auth from '../middleware/auth'

const router = express.Router()

router.route('/').get(getUsers).post(addUser)
router.route('/login').post(loginUser)
router.route('/wins').get(getWinsByUser)
router.route('/:name').get(auth, getUserScore)

export default router

import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { client } from '../db/prisma'

export const getUsers = asyncHandler(async (_, res) => {
	const user_data = await client.users.findMany({
		select: {
			id: true,
			total_score: true,
		},
	})
	res.status(200).json(user_data)
})

export const addUser = asyncHandler(async (req, res) => {
	const { name, password } = req.body
	if (!name || !password) {
		res.status(400)
		throw new Error('Name or password not supplied')
	}

	const userExists = await client.users.count({
		where: { name },
	})
	if (userExists) {
		res.status(400)
		throw new Error('Name taken')
	}

	const salt = await bcrypt.genSalt()
	const hashedPass = await bcrypt.hash(password, salt)
	const newUserData = await client.users.create({
		data: {
			name,
			pw: hashedPass,
		},
	})

	const token = generateToken(newUserData.id.toString())
	res.status(201).json({ token })
})

export const loginUser = asyncHandler(async (req, res) => {
	const { name, password } = req.body
	if (!name || !password) {
		res.status(400)
		throw new Error('Name or password not supplied')
	}

	const user = await client.users.findFirst({
		where: { name },
	})
	if (!user) {
		res.status(400)
		throw new Error('User does not exist')
	}

	const passMatches = await bcrypt.compare(password, user.pw)
	if (!passMatches) {
		res.status(401)
		throw new Error('Incorrect password')
	}

	const token = generateToken(user.id.toString())
	res.status(200).json({
		name: user.name,
		total_score: user.total_score,
		token,
	})
})

export const getUserScore = asyncHandler(async (req, res) => {
	const { name } = req.params
	if (!name) {
		res.status(400)
		throw new Error('Name not supplied')
	}

	//	check if user exists
	const user = await client.users.findFirst({
		where: { name },
	})
	if (!user) {
		res.status(400)
		throw new Error('User does not exist')
	}

	res.status(200).json({
		name: user.name,
		total_score: user.total_score,
	})
})

export const getWinsByUser = asyncHandler(async (req, res) => {
	const winsByUser = await client.wins.groupBy({
		by: ['name'],
		_sum: {
			score: true,
		},
		_count: {
			_all: true,
		},
		orderBy: {
			_sum: {
				score: 'desc',
			},
		},
	})

	const winsByUserWithIndexes = winsByUser.map((user, index) => {
		return {
			row_num: index + 1,
			name: user.name,
			total_score: user._sum.score,
			games_played: user._count._all,
		}
	})
	res.status(200).json(winsByUserWithIndexes)
})

function generateToken(id: string) {
	if (!process.env.JWT_SECRET) {
		throw new Error('Could not access JWT secret')
	}
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	})
}

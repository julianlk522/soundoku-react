import { createHmac } from 'crypto'
import asyncHandler from 'express-async-handler'
import { client } from '../db/prisma'
import { difficultyLevels } from './types'
import { getWinScore } from './util/score'

export const getWins = asyncHandler(async (req, res) => {
	const { page } = req.query
	const skip = page ? (+page - 1) * 10 : 0

	const wins = await client.wins.findMany({
		skip,
		take: 10,
		orderBy: {
			score: 'desc',
		},
		select: {
			name: true,
			date: true,
			difficulty: true,
			duration: true,
			errors: true,
			score: true,
		},
	})
	const winsWithIndexes = wins.map((win, index) => {
		return { row_num: index + skip + 1, ...win }
	})
	res.status(200).json(winsWithIndexes)
})

export const addWin = asyncHandler(async (req, res) => {
	const { name, difficulty, duration, errors, hash: clientHash } = req.body
	if (
		!name ||
		!difficulty ||
		!duration ||
		errors === undefined ||
		!clientHash
	) {
		res.status(400)
		throw new Error('Not all fields provided')
	}

	if (!difficultyLevels.includes(difficulty)) {
		res.status(400)
		throw new Error('Invalid difficulty level provided')
	}

	if (!process.env.WIN_SECRET) {
		res.status(500)
		throw new Error('Could not access hash secret')
	}

	const unserializedWin = { name, difficulty, duration, errors }
	const serializedWin = JSON.stringify(unserializedWin)

	const serverHash = createHmac('sha256', process.env.WIN_SECRET)
		.update(serializedWin)
		.digest('base64')

	if (serverHash !== clientHash) {
		res.status(401)
		throw new Error('Failed hash check')
	}

	const score = getWinScore(difficulty, duration, errors)
	try {
		await client.wins.create({
			data: {
				name,
				date: new Date().toISOString().split('T')[0],
				difficulty: difficulty.split(' ').join('_'),
				duration: +duration,
				errors: +errors,
				score: +score,
			},
		})

		await client.users.update({
			where: {
				name,
			},
			data: {
				total_score: {
					increment: score,
				},
			},
		})
	} catch (error) {
		res.status(500).json({
			error: 'Something went wrong while saving your win',
		})
	}

	res.status(201).json({ name, difficulty, duration, errors, score })
})

export const getWinsPages = asyncHandler(async (req, res) => {
	const wins = await client.wins.count()
	const pages = Math.ceil(wins / 10)
	res.status(200).json({ pages })
})

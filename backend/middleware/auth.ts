import { Request } from 'express'
import asyncHandler from 'express-async-handler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { client } from '../db/prisma'

interface reqWithUserId extends Request {
	user_id?: string
}

interface jwtPayloadWithId extends JwtPayload {
	id: string
}

const auth = asyncHandler(async (req: reqWithUserId, res, next) => {
	if (!process.env.JWT_SECRET) {
		res.status(500)
		throw new Error('Could not access JWT secret')
	}

	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith('Bearer')
	) {
		res.status(401)
		throw new Error('No bearer token')
	}

	let token: string
	try {
		token = req.headers.authorization.split(' ')[1]

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET
		) as jwtPayloadWithId

		const user = await client.users.findFirst({
			where: { id: +decoded.id },
		})
		if (!user) {
			res.status(401)
			throw new Error('Could not find user with given bearer token')
		}

		req.user_id = decoded.id
		return next()
	} catch (error) {
		console.error(error)
		res.status(401)
		throw new Error('Invalid bearer token')
	}
})

export default auth

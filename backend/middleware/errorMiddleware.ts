import { ErrorRequestHandler, NextFunction, Response } from 'express'

export const errorHandler: ErrorRequestHandler = (
	err: Error,
	_,
	res: Response,
	//	need next arg to prevent "res.status is not a function" errors even while it is not being used
	next: NextFunction
) => {
	const statusCode = res.statusCode ? res.statusCode : 500
	res.status(statusCode)
	res.json({
		error: err.message,
	})
}

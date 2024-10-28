import { ErrorRequestHandler, NextFunction, Response } from 'express'

export const errorHandler: ErrorRequestHandler = (
	err: Error,
	_,
	res: Response,
	//	need "_next" arg to prevent "res.status is not a function" errors even while it is not being used
	_next: NextFunction
) => {
	const statusCode = res.statusCode ? res.statusCode : 500
	res.status(statusCode)
	res.json({
		error: err.message,
	})
}

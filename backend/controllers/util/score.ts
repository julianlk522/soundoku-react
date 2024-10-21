import { difficultyLevels, DifficultyLevel } from '../types'

export function getWinScore(
	difficulty: DifficultyLevel,
	duration: number,
	errors: number
) {
	//	higher max points if difficulty is hard or very hard
	const difficultyBonus = Math.max(
		0,
		difficultyLevels.indexOf(difficulty) - 2
	)
	//	VE/E/M: 1000 max, H: 1250 max, VH: 1500 max
	const max = 1000 + 250 * difficultyBonus
	//	VE: 100 min, E: 200 min, M: 300 min ...
	const min = 100 * (difficultyLevels.indexOf(difficulty) + 1)
	const potentialLostScore = max - min

	//  cap error-based deductions at 30 errors
	const maxPenalizedErrors = 30
	const penalizedErrors = Math.min(errors, maxPenalizedErrors)

	//  lose up to 75% of potentialLostScore from errors
	const maxErrorPointDeductions = 0.75 * potentialLostScore
	const errorDeductions =
		(penalizedErrors / maxPenalizedErrors) * maxErrorPointDeductions

	const MINUTE = 60
	//  suppress duration-based deductions for first few minutes, depending on difficulty
	//	VE: first 120s, E: first 240s ...
	const gracePeriod = 2 * MINUTE * (difficultyLevels.indexOf(difficulty) + 1)

	if (duration > gracePeriod) {
		//  cap duration-based deductions at 45min
		const penalizedDurationStop = 45 * MINUTE
		const maxPenalizedDuration = penalizedDurationStop - gracePeriod

		//  lose up to 25% of potentialLostScore from time expenditure
		const maxDurationPointDeductions = 0.25 * potentialLostScore

		//	0 <= penalizedDuration <= maxPenalizedDuration
		const penalizedDuration = Math.max(
			0,
			Math.min(duration - gracePeriod, maxPenalizedDuration)
		)

		const durationDeductions =
			(penalizedDuration / maxPenalizedDuration) *
			maxDurationPointDeductions

		return Math.round(max - errorDeductions - durationDeductions)
	}
	return Math.round(max - errorDeductions)
}

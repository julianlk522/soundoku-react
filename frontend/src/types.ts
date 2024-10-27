export const difficulty_levels = [
	'Very Easy',
	'Easy',
	'Medium',
	'Hard',
	'Very Hard',
] as const
export type DifficultyLevel = (typeof difficulty_levels)[number]

type WinScore = {
	row_num: number
	name: string
	date: string
	difficulty: string
	score: number
	duration: string
	errors: number
}
type UserScore = {
	row_num: number
	name: string
	total_score: number
	games_played: number
}

const isWinScores = (ws: any): ws is WinScore[] =>
	ws[0].difficulty !== undefined
const isUserScores = (us: any): us is UserScore[] =>
	us[0].games_played !== undefined

export { isUserScores, isWinScores }
export type { UserScore, WinScore }

export const difficultyLevels = [
	'very easy',
	'easy',
	'medium',
	'hard',
	'very hard',
] as const

export type DifficultyLevel = typeof difficultyLevels[number]

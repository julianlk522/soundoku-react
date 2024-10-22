import { makepuzzle, solvepuzzle } from 'sudoku'

export function get_new_board_data(): [(number | undefined)[], number[]] {
	let board: (number | undefined)[] = makepuzzle()

	//  solvepuzzle() relies on a 0-8 range so it must be run before
	// re-mapping values to 1-9
	const solution: number[] = solvepuzzle(board).map((num: number) => num + 1)
	board = board.map((num: number | undefined) =>
		num != undefined ? num + 1 : undefined
	)
	const difficulty = 'Very Easy'
	board = fill_cells_to_decrease_difficulty(board, solution, difficulty)

	return [board, solution]
}

function fill_cells_to_decrease_difficulty(
	board: (number | undefined)[],
	solution: (number | undefined)[],
	difficulty?: string
) {
	let filled_nums_count = board.filter(
		(val: number | undefined) => val !== undefined
	).length

	let n = get_desired_filled_nums_count(difficulty) - filled_nums_count

	const checked_indices = []
	while (n > 0) {
		const random_index = Math.floor(Math.random() * 81)
		if (
			checked_indices.indexOf(random_index) === -1 &&
			board[random_index] === undefined
		) {
			board.splice(random_index, 1, solution[random_index])
			n--
		}
		checked_indices.push(random_index)
	}

	return board
}

function get_desired_filled_nums_count(difficulty?: string) {
	return difficulty === 'Very Easy'
		? 80
		: difficulty === 'Easy'
		? 60
		: difficulty === 'Medium'
		? 55
		: difficulty === 'Hard'
		? 50
		: 40
}

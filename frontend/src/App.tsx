import { useEffect, useRef, useState } from 'react'
import { makepuzzle, solvepuzzle } from 'sudoku'
import './App.css'
import Board from './components/Board'

function get_board_and_solution() {
	let board: (number | undefined)[] = makepuzzle()
	//  solvepuzzle() relies on a range of 0-8 so it must be run before
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
		? 70
		: difficulty === 'Easy'
		? 60
		: difficulty === 'Medium'
		? 55
		: difficulty === 'Hard'
		? 50
		: 40
}

function App() {
	const [initial_board, solution] = useRef(get_board_and_solution()).current

	const [board, set_board] = useState<(number | undefined)[]>(initial_board)
	const [selected_cell, set_selected_cell] = useState<number | undefined>(
		undefined
	)
	const [completed_cells, set_completed_cells] = useState<number[]>([])
	const [guess, set_guess] = useState<number | undefined>(undefined)

	useEffect(() => {
		if (!selected_cell || !guess) return

		if (guess === solution[selected_cell]) {
			set_completed_cells([...completed_cells, selected_cell])
			set_board((prev) => {
				prev[selected_cell] = solution[selected_cell]
				return prev
			})
		}
	}, [guess])

	return (
		<main>
			<h1>Soundoku</h1>
			<Board
				Board={board}
				CompletedCells={completed_cells}
				SelectedCell={selected_cell}
				SetSelectedCell={set_selected_cell}
				Guess={guess}
				SetGuess={set_guess}
			/>
		</main>
	)
}

export default App

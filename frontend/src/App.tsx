import { useEffect, useState } from 'react'
import { makepuzzle, solvepuzzle } from 'sudoku'
import './App.css'
import Board from './components/Board'

const difficulty = 'Very Easy'
let board: (number | undefined)[] = makepuzzle()
//  solvepuzzle() relies on a range of 0-8 so it must be run before
// re-mapping values to 1-9
const solution: number[] = solvepuzzle(board).map((num: number) => num + 1)
board = board.map((num: number | undefined) =>
	num != undefined ? num + 1 : undefined
)
console.log('solution: ', solution)
board = fill_cells_to_decrease_difficulty(board)
let rows = get_rows(board)
let completed_cells = new Set<number>()

function get_rows(board: (number | undefined)[]) {
	let rows: (number | undefined)[][] = []
	for (let i = 0; i < 9; i++) {
		rows.push(board.slice(i * 9, i * 9 + 9))
	}
	return rows
}

function fill_cells_to_decrease_difficulty(board: (number | undefined)[]) {
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
	const [selected_cell, set_selected_cell] = useState<number | undefined>(
		undefined
	)

	useEffect(() => {
		console.log('selected_cell: ', selected_cell)
	}, [selected_cell])

	return (
		<main>
			<h1>Soundoku</h1>
			<Board
				Rows={rows}
				CompletedCells={completed_cells}
				SelectedCell={selected_cell}
				SetSelectedCell={set_selected_cell}
			/>
		</main>
	)
}

export default App

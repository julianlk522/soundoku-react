import { useCallback } from 'react'
import './Board.css'
import Row from './Row'
import {
	navigation_keys,
	update_selected_cell_after_key_press,
} from './utils/keyboard_navigation'

interface Props {
	Board: (number | undefined)[]
	CompletedCells: number[]
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	Guess: number | undefined
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default function Board(props: Props) {
	const get_rows = useCallback((board: (number | undefined)[]) => {
		let rows: (number | undefined)[][] = []
		for (let i = 0; i < 9; i++) {
			rows.push(board.slice(i * 9, i * 9 + 9))
		}
		return rows
	}, [])

	const handle_keydown = useCallback(
		(event: React.KeyboardEvent<HTMLTableSectionElement>) => {
			if (props.SelectedCell === undefined) {
				props.SetSelectedCell(0)
				return
			}

			// if Arrow Keys or WASD, set selected cell
			if (navigation_keys[event.key] !== undefined) {
				props.SetSelectedCell(
					update_selected_cell_after_key_press(
						props.SelectedCell,
						event.key
					)
				)
			}
		},
		[props.SelectedCell]
	)

	return (
		<table id='board'>
			<tbody onKeyDown={handle_keydown}>
				{get_rows(props.Board).map((row, index) => (
					<Row
						key={index}
						Values={row}
						Column={index}
						CompletedCells={props.CompletedCells}
						SelectedCell={props.SelectedCell}
						SetSelectedCell={props.SetSelectedCell}
						Guess={props.Guess}
						SetGuess={props.SetGuess}
					/>
				))}
			</tbody>
		</table>
	)
}

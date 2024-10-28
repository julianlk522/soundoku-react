import { memo, useCallback, useMemo } from 'react'
import { get_audio_panning_from_cell_index, play_audio } from '../utils/audio'
import {
	navigation_keys,
	update_selected_cell_after_key_press,
} from '../utils/keyboard_navigation'
import './Board.css'
import Row from './Row'

interface Props {
	Board: (number | undefined)[]
	Solution: number[]
	CompletedCells: number[]
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	Guess: number | undefined
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
}

function Board(props: Props) {
	const rows = useMemo(() => {
		let rows: (number | undefined)[][] = []
		for (let i = 0; i < 9; i++) {
			rows.push(props.Board.slice(i * 9, i * 9 + 9))
		}
		return rows
	}, [props.Board])

	const handle_keydown = useCallback(
		(event: React.KeyboardEvent<HTMLTableSectionElement>) => {
			event.preventDefault()

			if (props.SelectedCell === undefined) {
				props.SetSelectedCell(0)
				return
			}

			if (event.key === 'Enter' || event.key === ' ') {
				play_audio(
					props.Solution[props.SelectedCell] - 1, // tone (1 per number, 0-8)
					get_audio_panning_from_cell_index(props.SelectedCell) // panning (-1 to 1)
				)
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
				{rows.map((row, index) => (
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

export default memo(Board)

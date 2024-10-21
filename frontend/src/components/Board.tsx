import { useCallback } from 'react'
import './Board.css'
import Row from './Row'

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

	return (
		<table id='board'>
			<tbody>
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

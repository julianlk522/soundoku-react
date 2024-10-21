import './Board.css'
import Row from './Row'

interface Props {
	Rows: (number | undefined)[][]
	CompletedCells: Set<number>
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	// HandleGuess: (value: number) => void
}

export default function Board(props: Props) {
	return (
		<table id='board'>
			<tbody>
				{props.Rows.map((row, index) => (
					<Row
						key={index}
						Values={row}
						Column={index}
						CompletedCells={props.CompletedCells}
						SelectedCell={props.SelectedCell}
						SetSelectedCell={props.SetSelectedCell}
						// HandleGuess={handleGuess}
					/>
				))}
			</tbody>
		</table>
	)
}

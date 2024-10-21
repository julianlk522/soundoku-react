import Cell from './Cell'

interface Props {
	Values: (number | undefined)[]
	Column: number
	CompletedCells: Set<number>
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	// HandleGuess: (value: number) => void
}

export default function Row(Props: Props) {
	return (
		<tr>
			{Props.Values.map((value, index) => {
				const cell_index = Props.Column * 9 + index
				return (
					<Cell
						key={index}
						Index={cell_index}
						Value={value}
						Completed={Props.CompletedCells.has(cell_index)}
						SelectedCell={Props.SelectedCell}
						SetSelectedCell={Props.SetSelectedCell}
						// HandleGuess={handleGuess}
					/>
				)
			})}
		</tr>
	)
}

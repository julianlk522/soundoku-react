import Cell from './Cell'

interface Props {
	Values: (number | undefined)[]
	Column: number
	CompletedCells: number[]
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	Guess: number | undefined
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default function Row(props: Props) {
	const {
		Values: values,
		Column: column,
		CompletedCells: completed_cells,
		SelectedCell: selected_cell,
		SetSelectedCell: set_selected_cell,
		Guess: guess,
		SetGuess: set_guess,
	} = props
	return (
		<tr>
			{values.map((value, i) => {
				const cell_index = column * 9 + i
				const selected = selected_cell === cell_index
				const completed = completed_cells.indexOf(cell_index) !== -1
				return (
					<Cell
						key={i}
						Index={cell_index}
						Value={value}
						Completed={completed}
						Selected={selected}
						SetSelectedCell={set_selected_cell}
						SetGuess={set_guess}
						Incorrect={
							selected && !completed && guess !== undefined
						}
					/>
				)
			})}
		</tr>
	)
}

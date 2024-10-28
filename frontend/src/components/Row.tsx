import { memo } from 'react'
import { is_related_to_selected_cell } from '../utils/related_cells'
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

function Row(props: Props) {
	const {
		Values: values,
		Column: column,
		CompletedCells: completed_cells,
		SelectedCell: selected_cell,
		SetSelectedCell: set_selected_cell,
		Guess: guess,
		SetGuess: set_guess,
	} = props
	const has_guessed = guess !== undefined
	return (
		<tr>
			{values.map((value, i) => {
				const cell_index = column * 9 + i
				const selected = selected_cell === cell_index
				const related_to_selected = is_related_to_selected_cell(
					selected_cell,
					column,
					i
				)
				const completed = completed_cells.indexOf(cell_index) !== -1
				const above_divider = column === 2 || column === 5
				const left_of_divider = i === 2 || i === 5
				return (
					<Cell
						key={i}
						Index={cell_index}
						Value={value}
						Completed={completed}
						Selected={selected}
						SetSelectedCell={set_selected_cell}
						RelatedToSelected={related_to_selected}
						SetGuess={set_guess}
						Incorrect={
							(selected && has_guessed && !completed) ||
							(related_to_selected &&
								has_guessed &&
								guess === value)
						}
						LeftOfDivider={left_of_divider}
						AboveDivider={above_divider}
					/>
				)
			})}
		</tr>
	)
}

export default memo(Row)

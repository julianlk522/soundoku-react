import './Cell.css'

interface Props {
	Index: number
	Value?: number
	Completed?: boolean
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	// HandleGuess: any
}

export default function Cell(Props: Props) {
	const {
		Index: index,
		Value: value,
		Completed: completed,
		SelectedCell: selected_cell,
	} = Props
	return (
		<td
			onClick={() => Props.SetSelectedCell(index)}
			className={`cell${completed ? ' completed' : ''}${
				value ? ' filled' : ''
			}${selected_cell === index ? ' selected' : ''}`}
			tabIndex={0}
		>
			{value}
		</td>
	)
}

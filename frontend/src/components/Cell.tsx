import { useCallback } from 'react'
import './Cell.css'

interface Props {
	Index: number
	Value?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	Selected: boolean
	Completed: boolean
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
	Incorrect: boolean
}

export default function Cell(Props: Props) {
	const {
		Index: index,
		Value: value,
		SetSelectedCell: set_selected_cell,
		Selected: selected,
		Completed: completed,
		SetGuess: set_guess,
		Incorrect: incorrect,
	} = Props

	const handle_enter = useCallback(
		(event: React.KeyboardEvent<HTMLTableCellElement>) => {
			if (event.key === 'Enter') {
				// play tone
			}

			// if Arrow Keys or WASD, set selected cell

			// if Number Keys, set guess
			if (!value && /^[1-9]$/i.test(event.key)) {
				Props.SetGuess(parseInt(event.key))
			}
		},
		[value]
	)

	const select_cell = useCallback(() => {
		set_selected_cell(index)
		set_guess(undefined)
	}, [index])

	return (
		<td
			onClick={select_cell}
			onFocus={select_cell}
			onKeyDown={handle_enter}
			className={`cell${completed ? ' completed' : ''}${
				value && !completed ? ' filled' : ''
			}${selected ? ' selected' : ''}${incorrect ? ' incorrect' : ''}`}
			tabIndex={0}
		>
			{value}
		</td>
	)
}

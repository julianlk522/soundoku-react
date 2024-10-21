import { RefObject, useCallback, useEffect, useRef } from 'react'
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

	const handle_keydown = useCallback(
		(event: React.KeyboardEvent<HTMLTableCellElement>) => {
			if (event.key === 'Enter') {
				// play tone
			}

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

	const self_ref: RefObject<HTMLTableCellElement> = useRef(null)
	useEffect(() => {
		if (selected && self_ref.current) {
			self_ref.current.focus()
		}
	}, [selected, self_ref])

	return (
		<td
			ref={self_ref}
			onClick={select_cell}
			onFocus={select_cell}
			onKeyDown={handle_keydown}
			className={`cell${completed ? ' completed' : ''}${
				value && !completed ? ' filled' : ''
			}${selected ? ' selected' : ''}${incorrect ? ' incorrect' : ''}`}
			tabIndex={0}
		>
			{value}
		</td>
	)
}

import { memo, RefObject, useCallback, useEffect, useRef } from 'react'
import './Cell.css'

interface Props {
	Index: number
	Value?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	Selected: boolean
	RelatedToSelected: boolean
	Completed: boolean
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
	Incorrect: boolean
	LeftOfDivider: boolean
	AboveDivider?: boolean
}

function Cell(Props: Props) {
	const {
		Index: index,
		Value: value,
		SetSelectedCell: set_selected_cell,
		Selected: selected,
		RelatedToSelected: related_to_selected,
		Completed: completed,
		SetGuess: set_guess,
		Incorrect: incorrect,
		LeftOfDivider: left_of_divider,
		AboveDivider: above_divider,
	} = Props

	const self_ref: RefObject<HTMLTableCellElement> = useRef(null)
	useEffect(() => {
		if (selected && self_ref.current) {
			self_ref.current.focus()
		}
	}, [selected, self_ref])

	const handle_keydown = useCallback(
		(event: React.KeyboardEvent<HTMLTableCellElement>) => {
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
			ref={self_ref}
			onFocus={select_cell}
			onKeyDown={handle_keydown}
			className={`cell${completed ? ' completed' : ''}${
				value && !completed ? ' filled' : ''
			}${selected ? ' selected' : ''}${
				related_to_selected ? ' related-to-selected' : ''
			}${incorrect ? ' incorrect' : ''}${
				left_of_divider ? ' left-of-divider' : ''
			}${above_divider ? ' above-divider' : ''}`}
			tabIndex={0}
		>
			{value}
		</td>
	)
}

export default memo(Cell)

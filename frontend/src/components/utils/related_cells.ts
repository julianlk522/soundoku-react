export function is_related_to_selected_cell(
	selected_cell: number | undefined,
	column: number,
	index_in_row: number
) {
	if (!selected_cell) {
		return false
	}
	if (is_selected_cell(selected_cell, column, index_in_row)) {
		return false
	}

	// same row
	if (column === Math.floor(selected_cell / 9)) {
		return true
	}

	// same column
	if (index_in_row === selected_cell % 9) {
		return true
	}

	// same box
	if (is_in_same_box_as_selected_cell(selected_cell, column, index_in_row)) {
		return true
	}

	return false
}

function is_selected_cell(
	selected_cell: number,
	column: number,
	index_in_row: number
) {
	const index = column * 9 + index_in_row
	return selected_cell === index
}

function is_in_same_box_as_selected_cell(
	selected_cell: number,
	column: number,
	index_in_row: number
) {
	//	same box rows
	return (
		Math.floor(selected_cell / 27) === Math.floor(column / 3) &&
		//	same box columns
		Math.floor((selected_cell % 9) / 3) === Math.floor(index_in_row / 3)
	)
}

interface NavigationKeyMappings {
	[key: string]: number
}

export const navigation_keys: NavigationKeyMappings = {
	ArrowUp: -9,
	ArrowLeft: -1,
	ArrowDown: 9,
	ArrowRight: 1,
	w: -9,
	a: -1,
	s: 9,
	d: 1,
	W: -9,
	A: -1,
	S: 9,
	D: 1,
}

export function update_selected_cell_after_key_press(
	selected_cell: number,
	key: string
) {
	if (is_at_left_edge(selected_cell) && navigation_keys[key] === -1) {
		return selected_cell + 8
	} else if (is_at_right_edge(selected_cell) && navigation_keys[key] === 1) {
		return selected_cell - 8
	} else if (is_at_top_edge(selected_cell) && navigation_keys[key] === -9) {
		return selected_cell + 72
	} else if (is_at_bottom_edge(selected_cell) && navigation_keys[key] === 9) {
		return selected_cell - 72
	} else {
		return selected_cell + navigation_keys[key]
	}
}

function is_at_left_edge(selected_cell: number) {
	return selected_cell % 9 === 0
}

function is_at_right_edge(selected_cell: number) {
	return selected_cell % 9 === 8
}

function is_at_top_edge(selected_cell: number) {
	return selected_cell < 9
}

function is_at_bottom_edge(selected_cell: number) {
	return selected_cell > 72
}

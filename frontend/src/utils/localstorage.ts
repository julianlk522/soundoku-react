export function get_name_and_token() {
	const name = localStorage.getItem('name')
	const token = localStorage.getItem('token')
	if (!name || !token) {
		return [null, null]
	}
	return [name, token]
}

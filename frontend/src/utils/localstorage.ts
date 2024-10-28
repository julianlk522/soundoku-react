function get_name_and_token() {
	const name = localStorage.getItem('name')
	const token = localStorage.getItem('token')
	if (!name || !token) {
		return [null, null]
	}
	return [name, token]
}

function unset_name_and_token() {
	localStorage.removeItem('name')
	localStorage.removeItem('token')
}

export { get_name_and_token, unset_name_and_token }

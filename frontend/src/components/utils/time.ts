export function get_time_in_minutes_and_seconds(total_seconds: number) {
	const minutes = Math.floor(total_seconds / 60)
	const remainder = total_seconds % 60
	const seconds = remainder < 10 ? '0' + remainder : remainder

	return `${minutes}:${seconds}`
}

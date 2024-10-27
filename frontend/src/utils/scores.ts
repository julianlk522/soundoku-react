import { WinScore } from '../types'
import { get_time_in_minutes_and_seconds } from './time'

export function format_score(score: WinScore) {
	score.date = format_date(new Date(score.date))
	score.duration = get_time_in_minutes_and_seconds(+score.duration)
	score.difficulty = score.difficulty
		.split('_')
		.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(' ')
	return score
}

function format_date(date: Date) {
	const year = date.getFullYear().toString().slice(-2)

	let month = (1 + date.getMonth()).toString()
	month = month.length > 1 ? month : '0' + month

	let day = date.getDate().toString()
	day = day.length > 1 ? day : '0' + day

	return month + '-' + day + '-' + year
}

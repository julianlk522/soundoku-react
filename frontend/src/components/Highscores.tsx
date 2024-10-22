import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../constants'
import { Score } from '../types'
import { format_score } from '../utils/scores'
import './Highscores.css'

interface Props {
	SetShowHighscores: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Highscores(props: Props) {
	const {
		isPending: is_pending,
		error,
		data: wins_data,
		isFetching: is_fetching,
	} = useQuery({
		queryKey: ['wins'],
		queryFn: async () => {
			const wins_resp = await fetch(API_URL + '/wins')
			const wins_data: Score[] = await wins_resp.json()
			return wins_data.map((score: Score) => format_score(score))
		},
	})

	return (
		<div id='highscores'>
			{is_pending || is_fetching ? <div id='loading'></div> : null}
			{error ? <div id='error'>{error.message}</div> : null}

			{wins_data?.length ? (
				<>
					<h2>Highscores</h2>
					<table>
						<thead>
							<tr>
								<th />
								<th>Name</th>
								<th>Date</th>
								<th>Difficulty</th>
								<th>Time</th>
								<th>Errors</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{wins_data.map((score: Score, i: number) => (
								<tr key={i}>
									<td>{score.row_num}</td>
									<td>{score.name}</td>
									<td>{score.date}</td>
									<td>{score.difficulty}</td>
									<td>{score.duration}</td>
									<td>{score.errors}</td>
									<td>{score.score}</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : null}

			<button
				id='close-highscores'
				onClick={() => props.SetShowHighscores(false)}
			>
				Close
			</button>
		</div>
	)
}

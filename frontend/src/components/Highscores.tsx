import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { USERS_ENDPOINT, WINS_ENDPOINT } from '../constants'
import { UserScore, WinScore, isUserScores, isWinScores } from '../types'
import { format_score } from '../utils/scores'
import './Highscores.css'

interface Props {
	SetShowHighscores: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Highscores(props: Props) {
	const [sort_method, set_sort_method] = useState<'wins' | 'users'>('wins')
	const wins_rankings_query = useQuery({
		queryKey: ['wins'],
		queryFn: async () => {
			const wins_resp = await fetch(WINS_ENDPOINT)
			const wins_data: WinScore[] = await wins_resp.json()
			return wins_data.map((score: WinScore) => format_score(score))
		},
		staleTime: 5 * 60,
	})
	const users_rankings_query = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const users_resp = await fetch(USERS_ENDPOINT + '/wins')
			const users_data: UserScore[] = await users_resp.json()
			return users_data
		},
	})
	const {
		data: rankings_data,
		error,
		isPending: is_pending,
		isFetching: is_fetching,
	} = sort_method === 'wins' ? wins_rankings_query : users_rankings_query

	return (
		<div id='highscores'>
			{is_pending || is_fetching ? <div id='loading'></div> : null}
			{error ? <div id='error'>{error.message}</div> : null}

			{rankings_data?.length ? (
				<>
					<h2>Highscores</h2>
					<table>
						<thead>
							<tr>
								<th />
								<th>Name</th>
								{isWinScores(rankings_data) ? (
									<>
										<th>Date</th>
										<th>Difficulty</th>
										<th>Time</th>
										<th>Errors</th>
										<th>Score</th>
									</>
								) : isUserScores(rankings_data) ? (
									<>
										<th>Total Score</th>
										<th>Games Played</th>
									</>
								) : null}
							</tr>
						</thead>
						<tbody>
							{isWinScores(rankings_data)
								? rankings_data.map(
										(score: WinScore, i: number) => (
											<tr key={i}>
												<td>{score.row_num}</td>
												<td>{score.name}</td>
												<td>{score.date}</td>
												<td>{score.difficulty}</td>
												<td>{score.duration}</td>
												<td>{score.errors}</td>
												<td>{score.score}</td>
											</tr>
										)
								  )
								: isUserScores(rankings_data)
								? rankings_data.map(
										(score: UserScore, i: number) => (
											<tr key={i}>
												<td>{score.row_num}</td>
												<td>{score.name}</td>
												<td>{score.total_score}</td>
												<td>{score.games_played}</td>
											</tr>
										)
								  )
								: null}
						</tbody>
					</table>
				</>
			) : null}

			<div id='highscores-actions'>
				<button
					id='close-highscores'
					onClick={() => props.SetShowHighscores(false)}
				>
					Close
				</button>
				<button
					id='change-highscores-sort-method'
					onClick={() =>
						set_sort_method(
							sort_method === 'wins' ? 'users' : 'wins'
						)
					}
				>
					By {sort_method === 'wins' ? 'Users' : 'Wins'}
				</button>
			</div>
		</div>
	)
}

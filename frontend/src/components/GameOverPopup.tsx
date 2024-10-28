import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CryptoJS from 'crypto-js'
import { useEffect, useState } from 'react'
import { WINS_ENDPOINT } from '../constants'
import { DifficultyLevel } from '../types'
import { get_new_board_data } from '../utils/board'
import { get_name_and_token } from '../utils/localstorage'
import { get_time_in_minutes_and_seconds } from '../utils/time'
import Auth from './Auth'
import './GameOverPopup.css'
import Highscores from './Highscores'

interface Props {
	Difficulty: DifficultyLevel | undefined
	GameTime: number
	SetGameTime: React.Dispatch<React.SetStateAction<number>>
	Errors: number
	SetErrors: React.Dispatch<React.SetStateAction<number>>
	SetBoard: React.Dispatch<
		React.SetStateAction<(number | undefined)[] | undefined>
	>
	SetSolution: React.Dispatch<React.SetStateAction<number[] | undefined>>
	SetCompletedCells: React.Dispatch<React.SetStateAction<number[]>>
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
	SetIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
	SetIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const highscores_query_client = new QueryClient()

export default function GameOverPopup(props: Props) {
	const {
		Difficulty: difficulty,
		GameTime: time,
		SetGameTime: set_game_time,
		Errors: errors,
		SetErrors: set_errors,
		SetBoard: set_board,
		SetSolution: set_solution,
		SetCompletedCells: set_completed_cells,
		SetSelectedCell: set_selected_cell,
		SetGuess: set_guess,
		SetIsGameOver: set_is_game_over,
		SetIsSignedIn: set_is_signed_in,
	} = props
	const formatted_time = get_time_in_minutes_and_seconds(time)

	const [show_highscores, set_show_highscores] = useState(false)
	const [show_auth, set_show_auth] = useState(false)
	const [is_waiting_for_auth_to_submit, set_is_waiting_for_auth_to_submit] =
		useState(false)

	const [can_submit_score, set_can_submit_score] = useState(true)

	function handle_replay() {
		set_errors(0)
		set_game_time(0)

		// generate new board
		const [board, solution] = get_new_board_data(difficulty ?? 'Very Easy')
		set_board(board)
		set_solution(solution)
		set_completed_cells([])
		set_selected_cell(undefined)
		set_guess(undefined)

		// reset
		set_is_game_over(false)
	}

	const [name, token] = get_name_and_token()
	async function handle_submit_score() {
		if (!name || !token) {
			set_show_auth(true)
			return
		}

		// TODO: add difficulty after implementing
		const unserialized_win = {
			name,
			difficulty: 'very easy',
			duration: time,
			errors: errors,
		}
		const serialized_win = JSON.stringify(unserialized_win)

		const secret = import.meta.env.VITE_WIN_SECRET
		if (!secret) {
			throw new Error(
				'Could not access hash secret from environment variable'
			)
		}
		const hash = CryptoJS.HmacSHA256(serialized_win, secret).toString(
			CryptoJS.enc.Base64
		)

		const submit_score_resp = await fetch(WINS_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify({
				...unserialized_win,
				hash: hash,
			}),
		})
		if (!submit_score_resp.ok) {
			console.error('Failed to submit score: ', submit_score_resp)
			set_show_auth(true)
			return
		}
		try {
			const submit_score_data = await submit_score_resp.json()
			if (!submit_score_data.score) {
				console.error('Failed to submit score: ', submit_score_data)
				return
			}

			// update UserInfo total score UI
			const total_score_elem = document.getElementById('total-score')
			if (total_score_elem && total_score_elem.textContent) {
				total_score_elem.textContent =
					+total_score_elem.textContent + submit_score_data.score
			}

			set_can_submit_score(false)
		} catch (error) {
			console.error('Failed to parse submission response: ', error)
		}
	}

	// submit score if user hit "submit score" and was redirected to signup/login
	// then successfully authenticated
	useEffect(() => {
		if (is_waiting_for_auth_to_submit) {
			handle_submit_score()
		}
		set_is_waiting_for_auth_to_submit(false)
	}, [is_waiting_for_auth_to_submit])

	return (
		<dialog open id='game-over'>
			{show_highscores ? (
				<QueryClientProvider client={highscores_query_client}>
					<Highscores SetShowHighscores={set_show_highscores} />
				</QueryClientProvider>
			) : show_auth ? (
				<Auth
					SetShowAuth={set_show_auth}
					SetIsWaitingForAuthToSubmit={
						set_is_waiting_for_auth_to_submit
					}
					SetIsSignedIn={set_is_signed_in}
				/>
			) : (
				<>
					<h2>You won!</h2>
					<p id='victory-flex'>💪✨🏆🎉</p>
					<span>{formatted_time} | </span>
					<span id='errors'>{errors}</span>
					<div id='game-over-actions'>
						<button onClick={handle_replay}>Replay</button>
						<button onClick={() => set_show_highscores(true)}>
							Show Highscores
						</button>
						<button
							disabled={
								name !== null &&
								token !== null &&
								!can_submit_score
							}
							onClick={handle_submit_score}
						>
							Submit Score
						</button>
					</div>
				</>
			)}
		</dialog>
	)
}

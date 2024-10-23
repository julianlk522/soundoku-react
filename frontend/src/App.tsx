import { useEffect, useRef, useState } from 'react'
import './App.css'
import Game from './components/Game'
import GameOverPopup from './components/GameOverPopup'
import UserInfo from './components/UserInfo'
import {
	arpeggio,
	get_audio_panning_from_cell_index,
	play_audio,
} from './utils/audio'
import { get_new_board_data } from './utils/board'
import { get_name_and_token } from './utils/localstorage'
import { get_time_in_minutes_and_seconds } from './utils/time'

function App() {
	const [is_signed_in, set_is_signed_in] = useState(false)
	const [name, token] = get_name_and_token()
	const [is_game_over, set_is_game_over] = useState(false)
	const [errors, set_errors] = useState(0)
	const [game_time, set_game_time] = useState(0)

	// During game
	const initial_board_data = useRef(get_new_board_data())
	const [initial_board, initial_solution] = initial_board_data.current
	const [board, set_board] = useState<(number | undefined)[]>(initial_board)
	const [solution, set_solution] = useState<number[]>(initial_solution)
	const [selected_cell, set_selected_cell] = useState<number | undefined>(
		undefined
	)
	const [completed_cells, set_completed_cells] = useState<number[]>([])
	const [guess, set_guess] = useState<number | undefined>(undefined)

	// handle guess
	useEffect(() => {
		if (!selected_cell || !guess) return

		// play tone of guessed number
		play_audio(guess - 1, get_audio_panning_from_cell_index(selected_cell))

		// verify
		if (guess === solution[selected_cell]) {
			set_completed_cells([...completed_cells, selected_cell])
			set_board((prev) => {
				prev[selected_cell] = solution[selected_cell]

				// check if game over
				if (prev.every((val) => val !== undefined)) handle_win()
				return prev
			})
		} else {
			set_errors((prev) => prev + 1)
		}
	}, [guess])

	// play audio from cell navigation
	useEffect(() => {
		if (!selected_cell) return

		play_audio(
			solution[selected_cell] - 1,
			get_audio_panning_from_cell_index(selected_cell)
		)
	}, [selected_cell])

	useEffect(() => {
		if (is_game_over) return
		const game_timer = setInterval(() => {
			set_game_time((prev) => prev + 1)
		}, 1000)

		return () => clearInterval(game_timer)
	}, [is_game_over])

	// check initially if user is signed in
	useEffect(() => {
		const [name, token] = get_name_and_token()
		if (!token || !name) return

		set_is_signed_in(true)
	}, [])

	function handle_win() {
		set_is_game_over(true)
		arpeggio()
	}

	return (
		<main>
			<Game
				Board={board}
				Solution={solution}
				CompletedCells={completed_cells}
				SelectedCell={selected_cell}
				SetSelectedCell={set_selected_cell}
				Guess={guess}
				SetGuess={set_guess}
				GameTime={get_time_in_minutes_and_seconds(game_time)}
				Errors={errors}
				IsGameOver={is_game_over}
			/>

			{is_signed_in ? (
				<UserInfo Name={name ?? ''} Token={token ?? ''} />
			) : null}

			{is_game_over ? (
				<GameOverPopup
					GameTime={game_time}
					SetGameTime={set_game_time}
					Errors={errors}
					SetErrors={set_errors}
					SetBoard={set_board}
					SetSolution={set_solution}
					SetCompletedCells={set_completed_cells}
					SetSelectedCell={set_selected_cell}
					SetGuess={set_guess}
					SetIsGameOver={set_is_game_over}
					SetIsSignedIn={set_is_signed_in}
				/>
			) : null}
		</main>
	)
}

export default App

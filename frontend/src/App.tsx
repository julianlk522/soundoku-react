import { useCallback, useEffect, useState } from 'react'
import './App.css'
import DifficultySelect from './components/DifficultySelect'
import Game from './components/Game'
import GameOverPopup from './components/GameOverPopup'
import UserInfo from './components/UserInfo'
import { DifficultyLevel } from './types'
import {
	get_audio_panning_from_cell_index,
	play_arpeggios,
	play_audio,
} from './utils/audio'
import { get_new_board_data } from './utils/board'
import { get_name_and_token } from './utils/localstorage'
import { get_time_in_minutes_and_seconds } from './utils/time'

function App() {
	// Auth
	const [is_signed_in, set_is_signed_in] = useState(false)
	const [name, token] = get_name_and_token()

	// Game Stats
	const [difficulty, set_difficulty] = useState<DifficultyLevel | undefined>(
		undefined
	)
	const [errors, set_errors] = useState(0)
	const [game_time, set_game_time] = useState(0)
	const [is_game_over, set_is_game_over] = useState(false)

	// During game
	const [board, set_board] = useState<(number | undefined)[] | undefined>(
		undefined
	)
	const [solution, set_solution] = useState<number[] | undefined>(undefined)
	const [selected_cell, set_selected_cell] = useState<number | undefined>(
		undefined
	)
	const [completed_cells, set_completed_cells] = useState<number[]>([])
	const [guess, set_guess] = useState<number | undefined>(undefined)

	// setup new board once difficulty has been assigned
	useEffect(() => {
		if (!difficulty) return

		setup_new_board(difficulty)
	}, [difficulty])

	const setup_new_board = useCallback(
		(difficulty: DifficultyLevel) => {
			const [new_board, new_solution] = get_new_board_data(difficulty)
			set_board(new_board)
			set_solution(new_solution)
		},
		[difficulty]
	)

	// handle guess
	useEffect(() => {
		if (selected_cell === undefined || !guess) return

		// play tone of guessed number
		play_audio(guess - 1, get_audio_panning_from_cell_index(selected_cell))

		// verify
		if (guess === solution![selected_cell]) {
			set_completed_cells([...completed_cells, selected_cell])
			set_board((prev) => {
				prev![selected_cell] = solution![selected_cell]

				// check if game over
				if (prev!.every((val) => val !== undefined)) handle_win()
				return prev
			})
		} else {
			set_errors((prev) => prev + 1)
		}
	}, [guess])

	function handle_win() {
		set_guess(undefined)
		set_selected_cell(undefined)
		set_is_game_over(true)
		play_arpeggios()
	}

	// play audio from cell navigation
	useEffect(() => {
		if (!solution || !selected_cell) return

		play_audio(
			solution[selected_cell] - 1,
			get_audio_panning_from_cell_index(selected_cell)
		)
	}, [selected_cell])

	// start timer when game start, clear timer when game ends
	useEffect(() => {
		if (!board || is_game_over) return
		const game_timer = setInterval(() => {
			set_game_time((prev) => prev + 1)
		}, 1000)

		return () => clearInterval(game_timer)
	}, [board, is_game_over])

	// check initially if user is signed in
	useEffect(() => {
		const [name, token] = get_name_and_token()
		if (!token || !name) return

		set_is_signed_in(true)
	}, [])

	return (
		<main>
			{!difficulty ? (
				<DifficultySelect SetDifficulty={set_difficulty} />
			) : board && solution ? (
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
			) : null}

			{is_signed_in ? (
				<UserInfo Name={name ?? ''} Token={token ?? ''} />
			) : null}

			{is_game_over ? (
				<GameOverPopup
					Difficulty={difficulty}
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

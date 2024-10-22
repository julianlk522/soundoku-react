import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { get_new_board_data } from '../utils/board'
import './GameOverPopup.css'
import Highscores from './Highscores'

interface Props {
	GameTime: string
	SetGameTime: React.Dispatch<React.SetStateAction<number>>
	Errors: number
	SetErrors: React.Dispatch<React.SetStateAction<number>>
	SetBoard: React.Dispatch<React.SetStateAction<(number | undefined)[]>>
	SetSolution: React.Dispatch<React.SetStateAction<number[]>>
	SetCompletedCells: React.Dispatch<React.SetStateAction<number[]>>
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
	SetIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
}

const highscores_query_client = new QueryClient()

export default function GameOverPopup(props: Props) {
	const {
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
	} = props

	const [show_highscores, set_show_highscores] = useState(false)

	function handle_replay() {
		set_errors(0)
		set_game_time(0)

		// generate new board
		const [board, solution] = get_new_board_data()
		set_board(board)
		set_solution(solution)
		set_completed_cells([])
		set_selected_cell(undefined)
		set_guess(undefined)

		// reset
		set_is_game_over(false)
	}

	return (
		<dialog open id='game-over'>
			{show_highscores ? (
				<QueryClientProvider client={highscores_query_client}>
					<Highscores SetShowHighscores={set_show_highscores} />
				</QueryClientProvider>
			) : (
				<>
					<h2>You won! Congratulations!</h2>
					<p id='victory-flex'>💪✨🏆🎉</p>
					<p>Your time was {time}</p>
					<p id='errors'>
						(with {errors} {errors === 1 ? 'error' : 'errors'})
					</p>
					<div id='game-over-actions'>
						<button onClick={handle_replay}>Replay</button>
						<button onClick={() => set_show_highscores(true)}>
							Show Highscores
						</button>
					</div>
				</>
			)}
		</dialog>
	)
}

import { get_new_board_data } from '../utils/board'
import './GameOverPopup.css'

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
			<h2>You won! Congratulations!</h2>
			<p id='victory-flex'>💪✨🏆🎉</p>
			<p>Your time was {time}</p>
			<p id='errors'>
				(with {errors} {errors > 1 ? 'errors' : 'error'})
			</p>

			<div id='game-over-actions'>
				<button onClick={handle_replay}>Replay</button>
			</div>
		</dialog>
	)
}

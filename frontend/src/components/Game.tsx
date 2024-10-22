import Board from './Board'
import './Game.css'

interface Props {
	Board: (number | undefined)[]
	Solution: number[]
	CompletedCells: number[]
	SelectedCell?: number
	SetSelectedCell: React.Dispatch<React.SetStateAction<number | undefined>>
	Guess: number | undefined
	SetGuess: React.Dispatch<React.SetStateAction<number | undefined>>
	GameTime: string
	Errors: number
	IsGameOver: boolean
}

export default function Game(props: Props) {
	const {
		Board: board,
		Solution: solution,
		CompletedCells: completed_cells,
		SelectedCell: selected_cell,
		SetSelectedCell: set_selected_cell,
		Guess: guess,
		SetGuess: set_guess,
		GameTime: game_time,
		Errors: errors,
		IsGameOver: is_game_over,
	} = props
	return (
		<section id='game' className={is_game_over ? 'game-over' : ''}>
			<h1>Soundoku</h1>
			<Board
				Board={board}
				Solution={solution}
				CompletedCells={completed_cells}
				SelectedCell={selected_cell}
				SetSelectedCell={set_selected_cell}
				Guess={guess}
				SetGuess={set_guess}
			/>
			<p id='time'>Time: {game_time}</p>
			<p id='errors'>Errors: {errors}</p>
		</section>
	)
}

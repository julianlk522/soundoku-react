import { difficulty_levels, DifficultyLevel } from '../types'
import './DifficultySelect.css'

interface Props {
	SetDifficulty: React.Dispatch<
		React.SetStateAction<DifficultyLevel | undefined>
	>
}

export default function DifficultySelect(props: Props) {
	const set_difficulty = props.SetDifficulty
	return (
		<div>
			<h1>Select Difficulty Level</h1>
			<select name='difficulty' id='difficulty-select'>
				{difficulty_levels.map((difficulty) => (
					<option key={difficulty} value={difficulty}>
						{difficulty}
					</option>
				))}
			</select>
			<button
				id='start-game'
				onClick={() => {
					const selected_difficulty = (
						document.getElementById(
							'difficulty-select'
						) as HTMLSelectElement
					).value as DifficultyLevel
					set_difficulty(selected_difficulty)
				}}
			>
				Start
			</button>
		</div>
	)
}

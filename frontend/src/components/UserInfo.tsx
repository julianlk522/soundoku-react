import { useCallback, useEffect, useState } from 'react'
import { USERS_ENDPOINT } from '../constants'
import { unset_name_and_token } from '../utils/localstorage'
import './UserInfo.css'

interface Props {
	Name: string
	Token: string
}
export default function UserInfo(props: Props) {
	const { Name: name, Token: token } = props
	const [total_score, set_total_score] = useState(0)

	const get_total_score_for_user = useCallback(async () => {
		const resp = await fetch(USERS_ENDPOINT + '/' + name, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + props.Token,
			},
		})
		if (resp.status === 401) {
			unset_name_and_token()
			return
		}
		if (!resp.ok) {
		}
		const data = await resp.json()
		if (!data.total_score) {
			console.error('Unable to retrieve total score for user')
			return
		}

		set_total_score(data.total_score)
	}, [name, token])

	useEffect(() => {
		get_total_score_for_user()
	}, [get_total_score_for_user])

	return (
		<div id='user-info'>
			<p>
				<span id='name'>{props.Name}</span>
				<span id='separator'>|</span>
				<span id='total-score'>{total_score}</span>
			</p>
		</div>
	)
}

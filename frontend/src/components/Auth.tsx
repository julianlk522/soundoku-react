import { USERS_ENDPOINT } from '../constants'

interface Props {
	SetShowAuth: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Auth(props: Props) {
	async function authenticate(
		event: React.FormEvent<HTMLFormElement>,
		is_login?: boolean
	) {
		event.preventDefault()
		const form = event.target as HTMLFormElement
		const formData = new FormData(form)
		const name = formData.get('name')
		const password = formData.get('password')

		if (!name || !password) {
			return
		}

		let endpoint = USERS_ENDPOINT
		if (is_login) {
			endpoint += '/login'
		}
		const resp = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, password }),
		})
		const data = await resp.json()

		if (!data.token) {
			alert('Did not retrieve token...')
		}

		localStorage.setItem('token', data.token)
		localStorage.setItem('name', name.toString())
		props.SetShowAuth(false)
	}

	return (
		<>
			<h2>Login or Signup</h2>
			<p>
				Login required for submitting scores to the server, but you can
				skip if you just want to play locally.
			</p>

			<form id='login' onSubmit={(e) => authenticate(e, true)}>
				<label htmlFor='name'>Name</label>
				<input type='text' name='name' />
				<br />
				<label htmlFor='password'>Password</label>
				<input type='password' name='password' />
				<br />
				<input type='submit' value='Login' />
			</form>

			<form id='sigmup' onSubmit={authenticate}>
				<label htmlFor='name'>Name</label>
				<input type='text' name='name' />
				<br />
				<label htmlFor='password'>Password</label>
				<input type='password' name='password' />
				<br />
				<input type='submit' value='Signup' />
			</form>

			<button>Skip (play locally)</button>
		</>
	)
}
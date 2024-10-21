const notes = [
	{
		name: 'C',
		frequency: 261.63,
	},
	{
		name: 'C#',
		frequency: 277.18,
	},
	{
		name: 'D',
		frequency: 293.66,
	},
	{
		name: 'Eb',
		frequency: 311.13,
	},
	{
		name: 'E',
		frequency: 329.63,
	},
	{
		name: 'F',
		frequency: 349.23,
	},
	{
		name: 'F#',
		frequency: 369.99,
	},
	{
		name: 'G',
		frequency: 392,
	},
	{
		name: 'Ab',
		frequency: 415.3,
	},
]

let audio_ctx = new AudioContext()
let oscillator: OscillatorNode
let gain_node: GainNode

let last_note_time = 0
let time_since_last_note: number | undefined = undefined

const min_wait_period_before_cutting_attack = 0.1
const min_attack_time = 0.01
const max_attack_time = 0.2
const attack_time_delta = 0.5

let attack_time = min_attack_time
const decay_time = 0.1
const release_volume = 0.25
const release_time = 1.5
const note_duration = attack_time + decay_time + release_time

export function play_audio(tone: number, panning?: number) {
	time_since_last_note = audio_ctx.currentTime - last_note_time

	const spamming_notes =
		time_since_last_note <= min_wait_period_before_cutting_attack

	if (spamming_notes) {
		stop_audio()
		recalculate_attack_time()
	} else attack_time = min_attack_time

	init(panning)
	generate_oscillation(tone)

	last_note_time = audio_ctx.currentTime
}

function init(panning?: number) {
	oscillator = audio_ctx.createOscillator()
	gain_node = audio_ctx.createGain()

	//	set panning if needed, otherwise connect oscillator directly to gainNode
	if (panning) {
		const panner = new StereoPannerNode(audio_ctx, {
			pan: panning,
		})
		oscillator.connect(panner)
		panner.connect(gain_node)
	} else {
		oscillator.connect(gain_node)
	}
	gain_node.connect(audio_ctx.destination)
}

function generate_oscillation(toneIndex: number) {
	oscillator.frequency.value = notes[toneIndex].frequency

	const now = audio_ctx.currentTime
	const peak_volume = 0.5

	gain_node.gain.exponentialRampToValueAtTime(0.00001, now)
	gain_node.gain.exponentialRampToValueAtTime(peak_volume, now + attack_time)
	gain_node.gain.linearRampToValueAtTime(
		release_volume,
		now + attack_time + decay_time
	)
	gain_node.gain.exponentialRampToValueAtTime(0.0001, now + note_duration)

	oscillator.start(now)
	oscillator.stop(now + note_duration)
}

function stop_audio() {
	if (!oscillator) return

	gain_node.gain.exponentialRampToValueAtTime(
		0.00001,
		audio_ctx.currentTime + min_attack_time
	)
	oscillator.stop(audio_ctx.currentTime + min_attack_time)
}

function recalculate_attack_time() {
	if (time_since_last_note! < min_wait_period_before_cutting_attack) {
		attack_time = Math.min(
			attack_time + attack_time_delta * (max_attack_time - attack_time),
			max_attack_time
		)
	} else {
		attack_time = Math.max(
			attack_time - attack_time_delta * (attack_time - min_attack_time),
			min_attack_time
		)
	}
}

export function arpeggio() {
	const notes = [1, 3, 5, 8, 5, 3, 1]

	let index = 0
	const arpeggio_interval = setInterval(() => {
		if (index < notes.length) {
			play_audio(notes[index] - 1)
			index++
		} else clearInterval(arpeggio_interval)
	}, 200)
}

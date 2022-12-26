<script lang="ts">
	import { difficulty, maxGuessingTime, musicVolume, sfxVolume } from '$lib/store';
</script>

<div class="settings-area">
    <h1>Word Splat</h1>
	<div class="input-area">
		<div class="form-control">
			<label for="maxGuessingTime">Max guessing time</label>
			<input
				id="maxGuessingTime"
				type="number"
                size="2"
				min="3"
				max="14"
				placeholder="Timeout in seconds"
				bind:value={$maxGuessingTime}
			/>
		</div>
		<div class="form-control">
			<label for="difficulty">Difficulty</label>
			<input
				id="difficulty"
				type="range"
				placeholder="Difficulty"
				min="1"
				max="3"
				bind:value={$difficulty}
			/>
		</div>
		<div class="form-control">
			<label for="musicVolume">Music volume</label>
			<input
				id="musicVolume"
				type="range"
				min="0"
				max="1"
				step="0.05"
				bind:value={$musicVolume}
			/>
		</div>
		<div class="form-control">
			<label for="sfxVolume">Sound effects volume</label>
			<input
				id="sfxVolume"
				type="range"
				min="0"
				max="1"
				step="0.05"
				bind:value={$sfxVolume}
			/>
		</div>
		<p>
			<a class="start-button" href="/game">Start</a>
		</p>
		<p>
			<small>
				Sounds from mixkit.com
			</small>
		</p>
	</div>
</div>

<style>
	.settings-area {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		font-family: 'Compagnon Medium';
		background-color: whitesmoke;
		box-sizing: border-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
	}
	.input-area {
		padding: 2rem;
		text-align: center;
		background-color: lightgray;
		border-radius: 1.5rem;
	}
	input {
		font-family: 'Compagnon Medium', monospace;
	}
	input[type='number'] {
		padding: 0.5rem 1rem;
		border: none;
		background-color: whitesmoke;
		border-radius: 0.5rem;
		outline: none !important;
        -moz-appearance: textfield;
        appearance: textfield;
	}
    ::-moz-selection { /* Code for Firefox */
    color: white;
    background: black;
    }

    ::selection {
    color: white;
    background: black;
    }
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
	input[type='number']:focus {
		background-color: white;
	}
	input[type='range'] {
		/* padding: 0.5rem 1rem; */
		border: none;
		background-color: white;
		border-radius: 0.5rem;
		-webkit-appearance: none;
		/* width: 100%; */
		height: 8px;
		outline: none !important;
		appearance: none;
		border: none;
		border-radius: 30px;
	}
	input[type='range']::-moz-focus-outer {
		border: 0;
	}
	input[type='range']:hover {
		outline: none;
	}

	/* Chrome */

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 9px;
		height: 9px;
		background: #fff;
		cursor: pointer;
		border-radius: 30px;
		outline: none;
	}

	/* Moz */

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
		border: none;
		outline: none;
	}
	input[type='range']::-moz-range-progress {
		background-color: #fff;
		height: 100%;
		border-radius: 30px;
		border: none;
	}
	input[type='range']::-moz-range-track {
		background-color: #aaa;
		border-radius: 30px;
		border: none;
		height: 100%;
	}

	/* IE*/

	input[type='range']::-ms-fill-lower {
		background-color: #fff;
		height: 100%;
		border-radius: 30px;
		border: none;
	}
	input[type='range']::-ms-fill-upper {
		background-color: #ccc;
		border-radius: 30px;
		border: none;
		height: 100%;
	}
	label {
		padding-right: 1em;
	}
	.form-control {
		width: 100%;
		padding-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.start-button {
        display: inline-block;
		border-radius: 1rem;
		padding: 0.3rem 2rem 1rem 2rem;
		box-shadow: 0 0.5rem black;
		font-family: 'Compagnon Bold', 'Courier New', 'Courier', monospace;
		transform: translateY(-0.5rem);
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		text-decoration: none;
		color: inherit;
		font-size: 1.5em;
		background-color: white;
	}
	.start-button:hover {
		cursor: pointer;
	}
	.start-button:active {
		transform: translateY(0rem);
		box-shadow: none;
	}
	.start-button:visited {
		color: inherit;
	}
    p {
        margin-bottom: 0;
    }
    h1 {
        font-family: 'Compagnon Roman', 'Courier New', Courier, monospace;
        font-weight: normal;
    }
</style>

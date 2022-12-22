<script lang="ts">
	import choose from '../../util/choose';
	import ngramList from '../../util/ngramList';
	import wordList from '../../util/wordList';
	import { onMount } from 'svelte';
	// export const prerender = false; // disable ssr for this
	// export const ssr = false; // disable ssr for this

	// import type { PageData } from './$types';
	import RandomText from './RandomText.svelte';
	import HighlightWord from './HighlightWord.svelte';
	// import { requestTimeout } from '../../util/rafTimers';

	enum GameState {
		Loading,
		Guessing,
		Dead
	}

	const charSize = 40;
	const difficulty = 1;
	const maxDifficulty = 3;
	const maxGuessingTime = 5; // seconds
	const undoGuessingTime = 3;
	let nChars = 720 / charSize; // this changes dynamically

	const alphabet = 'ABCDEFGGHIJKLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz';
	const xletters = 'X';

	const subset = ngramList.slice(
		Math.floor((ngramList.length / maxDifficulty) * (difficulty - 1)),
		Math.floor((ngramList.length / maxDifficulty) * difficulty)
	);
	const chooseNgram = () => choose(subset); // todo: convert to partial

	let ngram: string;
	let ngramHistory: string[] = [];
	let hiddenWord: string;

	// Game state tracking
	let gameState = GameState.Loading;
	let deathTimer: number;
    let deathIcon: string;

	function cancelDeathTimer() {
		if (deathTimer) clearTimeout(deathTimer);
	}
	function startDeathTimer(ms: number = maxGuessingTime * 1000) {
		cancelDeathTimer();
		deathTimer = setTimeout(die, ms);
		return deathTimer;
	}
	function die() {
		cancelDeathTimer();
		hiddenWord = getWordForNgram(ngram);
		gameState = GameState.Dead;
        deathIcon = choose([":(", "bye!", "🗿", "☠"]);
	}
	function reset() {
		cancelDeathTimer();
		if (ngram) ngramHistory = [...ngramHistory, ngram];
		console.log(ngramHistory);
		ngram = chooseNgram();
        // nChars = nChars + ((nChars + ngram.length) % 2) * (1 - ((ngram.length % 2) * 2))
		gameState = GameState.Guessing;
		startDeathTimer();
	}
	function undo() {
		if (ngramHistory.length > 0) {
			ngram = ngramHistory[ngramHistory.length - 1];
			ngramHistory = ngramHistory.slice(0, ngramHistory.length - 1);
			cancelDeathTimer();
			gameState = GameState.Guessing;
			startDeathTimer(undoGuessingTime * 1000);
		}
	}
	function getWordForNgram(ngram: string) {
		const regexp = new RegExp(ngram);
		console.log(wordList.filter((word) => regexp.test(word)).slice(0, 10));
		return choose(wordList.filter((word) => regexp.test(word)).slice(0, 10)); // yeuch.. maybe could be partial or called
	}

	function handleKeyup(e: KeyboardEvent) {
		if (e.key === ' ') reset();
	}

	onMount(() => {
		reset(); // i.e. start
		nChars =
			Math.floor(Math.min(window?.innerWidth || 720, 720) / charSize / 1.4) - (ngram.length % 2);
        nChars -= (1 - nChars % 2);
	});

	// TODO figure out the height stuff
</script>

<svelte:window on:keyup={handleKeyup} />

<div class="game-container">
	{#if gameState == GameState.Guessing}
		<div class="hidden-word">??????</div>
		<div class="text-container">
			<!-- {#each Array(3) as _, i}
                {/each} -->
			<RandomText length={nChars} letters={alphabet} />
			<br />
			<RandomText length={Math.floor((nChars - 3) / 2)} letters={alphabet} /><span
				class="ngram">{ngram}</span
			><RandomText
				length={nChars - 3 - Math.floor(Math.abs((nChars - 3) / 2))}
				letters={alphabet}
			/>
			<br />
			<RandomText length={nChars} letters={alphabet} />
			<!-- {#each Array(3) as _, i}
                    {/each} -->
		</div>
		<div class="button-container">
			<button class="defuse-button" on:click={reset}>Defuse</button>
			{#if ngramHistory.length > 0}
                <button class="undo-button" on:click={undo}>←</button>
			{/if}
        </div>
		<p style="height: 1em">↓</p>
	{/if}
	{#if gameState == GameState.Dead}
		<div class="hidden-word"><HighlightWord word={hiddenWord} substring={ngram} /></div>
		<div class="text-container" class:bombed={gameState == GameState.Dead}>
			<RandomText length={nChars} letters={xletters} />
			<br />
			<RandomText length={Math.floor((nChars - 3) / 2)} letters={xletters} /><span
				class="ngram">{ngram}</span
			><RandomText
				length={nChars - 3 - Math.floor(Math.abs((nChars - 3) / 2))}
				letters={xletters}
			/>
			<br />
			<RandomText length={nChars} letters={xletters} />
			<!-- <RandomText length={Math.max(nChars, hiddenWord.length)} letters={xletters} /><br />
			<RandomText length={Math.floor(((nChars - hiddenWord.length) / 2))} letters={xletters} /><span
				class="ngram"><HighlightWord word={hiddenWord} substring={ngram} /></span
			><RandomText
				length={nChars - hiddenWord.length - Math.floor(Math.abs((nChars - hiddenWord.length) / 2))}
				letters={xletters}
			/>
			<br />
			<RandomText length={Math.max(nChars, hiddenWord.length)} letters={xletters} /> -->
		</div>
		<div class="button-container">
			<button class="resume-button" on:click={reset}>Resume</button>
			{#if ngramHistory.length > 0}
				<button class="undo-button" on:click={undo}>←</button>
			{/if}
        </div>
		<p style="height: 1em">{deathIcon}</p>
	{/if}
</div>

<style>
    .game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 2em;
		font-family: 'Compagnon Roman', 'Courier New', 'Courier', monospace;
		min-height: 100vh;
		max-width: 100%;
		overflow-x: auto;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
        background-color: #eee;
	}
    .text-container {
		font-family: 'Compagnon Medium', 'Courier', monospace;
		font-size: 2em;
		color: gray;
		pointer-events: none;
		/* white-space: nowrap; */
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		text-transform: uppercase;
		font-variant-ligatures: none;
        padding: 0 1rem 1rem 1rem;
        border-radius: 1rem;
        border: 4px solid lightgray;
        background-color: white;
        box-shadow: 0 4px black;
        margin-bottom: 2rem;
		/* position: absolute; */
		/* line-height: 0.7; */
		/* top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) */
	}
	.bombed {
		animation: flicker 200ms infinite;
	}
	.hidden-word {
		font-size: 2rem;
		pointer-events: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		font-family: 'Compagnon Roman', 'Courier New', 'Courier', monospace;
        margin-bottom: 1rem;
	}
	.ngram {
		font-family: 'Compagnon Medium', 'Courier New', 'Courier', monospace;
		color: black;
        width: 3ch;
        display: inline-block;
        text-align: center;
	}
	button {
		border: none;
		border-radius: 1rem;
		padding: 0.3rem 2rem 1rem 2rem;
		box-shadow: 0 0.5rem black;
		font-family: 'Compagnon Bold', 'Courier New', 'Courier', monospace;
		transform: translateY(-0.5rem);
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
	}
	button:hover {
		cursor: pointer;
	}
	button:active {
		transform: translateY(0rem);
		box-shadow: none;
	}
	.button-container {
		position: relative;
	}
	.resume-button {
		font-size: 1em;
		font-family: 'Compagnon Bold', 'Courier New', 'Courier', monospace;
		background-color: lightgray;
	}
	.resume-button:hover {
		background-color: lightgray;
	}
	.resume-button:active {
		background-color: black;
		color: white;
	}
	.undo-button {
		/* box-shadow: none;
		background-color: transparent; */
        background-color: lightgray;
        padding: 0.3rem 1.2rem 1rem 1.2rem;
		font-size: 1em;
        font-family: 'Compagnon Roman', 'Courier New', 'Courier', monospace;
		/* padding: 0.2rem; */
        /* transform: translate(0) */
	}
	.undo-button:hover,
	.undo-button:active {
		/* background-color: transparent; */
	}
	.defuse-button {
		font-size: 1em;
		background-color: lightgray;
		color: black;
		display: inline-flex;
		align-items: center;
		/* line-height: 0.7; */
		/* height: 2em; */
	}
	.defuse-button:hover {
		color: black;
		background-color: lightgray;
	}
	.defuse-button:active {
		color: white;
		background-color: black;
	}
	@keyframes flicker {
		0% {
			background-color: #eee;
		}
		50% {
			background-color: white;
		}
		100% {
			background-color: #eee;
		}
	}
</style>

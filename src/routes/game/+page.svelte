<script lang="ts">
	import choose from '../../util/choose';
	import ngramList from '../../util/ngramList';
	import wordList from '../../util/wordList';
	import { onMount } from 'svelte';
	// export const prerender = false; // disable ssr for this
	// export const ssr = false; // disable ssr for this

	import type { PageData } from './$types';
	import RandomText from './RandomText.svelte';
	import HighlightWord from './HighlightWord.svelte';
	import { requestTimeout } from '../../util/rafTimers';
	export let data: PageData;
	const charSize = 40;
	let nChars = 720 / charSize;
	const difficulty = 1;
	const maxDifficulty = 3;
	const subset = ngramList.slice(
		Math.floor((ngramList.length / maxDifficulty) * (difficulty - 1)),
		Math.floor((ngramList.length / maxDifficulty) * difficulty)
	);
	const chooseNgram = () => choose(subset);

	let ngram: string;
	const alphabet = 'ABCDEFGGHIJKLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz';
	const xletters = 'X';
	enum GameState {
		Loading,
		Guessing,
		Dead
	}
	let gameState = GameState.Loading;

	let hiddenWord: string;

	let deathTimer: string | number | NodeJS.Timeout;

	const maxGuessingTime = 5;

	function cancelDeathTimer() {
		if (deathTimer) clearTimeout(deathTimer);
	}

	function startDeathTimer() {
		cancelDeathTimer();
		deathTimer = setTimeout(die, maxGuessingTime * 1000);
		return deathTimer;
	}
	function die() {
		cancelDeathTimer();
		hiddenWord = getWordForNgram(ngram);
		gameState = GameState.Dead;
	}
	function reset() {
		cancelDeathTimer();
		ngram = chooseNgram();
		gameState = GameState.Guessing;
		startDeathTimer();
	}
	function getWordForNgram(ngram: string) {
		const regexp = new RegExp(ngram);
		console.log(wordList.filter((word) => regexp.test(word)).slice(0, 10));
		return choose(wordList.filter((word) => regexp.test(word)).slice(0, 10)); // yeuch.. maybe could be partial or called
	}

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === " ") reset();
    }

	onMount(() => {
		nChars = Math.floor(Math.min(window?.innerWidth || 720, 720) / charSize / 1.4);
		reset(); // i.e. start
	});

	// TODO figure out the height stuff
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="game-container">
	<h1>Word Bomb</h1>
	{#if gameState == GameState.Guessing}
		<div class="text-container">
			<!-- {#each Array(3) as _, i}
            {/each} -->
			<RandomText length={nChars} letters={alphabet} />
			<br />
			<RandomText length={Math.floor(nChars / 2) - 1} letters={alphabet} /><span class="ngram"
				>{ngram}</span
			><RandomText length={Math.floor(nChars / 2) + 1 - ngram.length} letters={alphabet} />
			<br />
			<RandomText length={nChars} letters={alphabet} />
			<!-- {#each Array(3) as _, i}
            {/each} -->
		</div>
		<p>
			<button class="defuse-button" on:click={reset}>Defuse</button>
		</p>
		<p>↓</p>
	{/if}
	{#if gameState == GameState.Dead}
		<div class="text-container">
			<RandomText length={Math.max(nChars, hiddenWord.length)} letters={xletters} /><br />
			<RandomText length={Math.floor((nChars - hiddenWord.length) / 2)} letters={xletters} /><span
				class="ngram"><HighlightWord word={hiddenWord} substring={ngram} /></span
			><RandomText
				length={nChars - hiddenWord.length - Math.floor((nChars - hiddenWord.length) / 2)}
				letters={xletters}
			/>
			<br />
			<RandomText length={Math.max(nChars, hiddenWord.length)} letters={xletters} />
		</div>
		<p>
			<button class="resume-button" on:click={reset}>Resume</button>
		</p>
		<p>:(</p>
	{/if}
</div>

<style>
	@font-face {
		font-family: 'Compagnon Roman';
		src: url('/fonts/Compagnon-Roman.eot');
		src: url('/fonts/Compagnon-Roman.eot?#iefix')
				format('embedded-opentype'),
			url('/fonts/Compagnon-Roman.woff') format('woff2'),
			url('/fonts/Compagnon-Roman.woff2') format('woff'),
			url('/fonts/Compagnon-Roman.ttf') format('truetype'),
			url('/fonts/Compagnon-Roman.svg') format('svg');
		font-weight: normal;
		font-style: normal;
	}
    @font-face {
		font-family: 'Compagnon Bold';
		src: url('/fonts/Compagnon-Bold.eot');
		src: url('/fonts/Compagnon-Bold.eot?#iefix')
				format('embedded-opentype'),
			url('/fonts/Compagnon-Bold.woff') format('woff2'),
			url('/fonts/Compagnon-Bold.woff2') format('woff'),
			url('/fonts/Compagnon-Bold.ttf') format('truetype'),
			url('/fonts/Compagnon-Bold.svg') format('svg');
		font-weight: bold;
		font-style: normal;
	}
    @font-face {
		font-family: 'Compagnon Medium';
		src: url('/fonts/Compagnon-Medium.eot');
		src: url('/fonts/Compagnon-Medium.eot?#iefix')
				format('embedded-opentype'),
			url('/fonts/Compagnon-Medium.woff') format('woff2'),
			url('/fonts/Compagnon-Medium.woff2') format('woff'),
			url('/fonts/Compagnon-Medium.ttf') format('truetype'),
			url('/fonts/Compagnon-Medium.svg') format('svg');
		font-weight: bold;
		font-style: normal;
	}
	h1 {
		font-size: 2rem;
		font-family: 'Compagnon Roman';
	}
	.ngram {
		font-family: 'Compagnon Medium';
		color: black;
	}
	button {
		border: none;
		border-radius: 1rem;
		padding: 0.3rem 2rem 1rem 2rem;
		box-shadow: 0 0.5rem black;
		font-family: 'Compagnon Bold';
		transform: translateY(-0.5rem);
	}
	button:hover {
		cursor: pointer;
	}
	button:active {
		transform: translateY(0rem);
		box-shadow: none;
	}
	.resume-button {
		font-size: 1em;
		font-family: 'Compagnon Bold';
		background-color: gainsboro;
	}
	.resume-button:hover {
		background-color: lightgray;
	}
	.resume-button:active {
		background-color: black;
		color: white;
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
	.game-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		height: 100vh;
		text-align: center;
		font-size: 2em;
		font-family: 'Compagnon Roman';
	}
	.text-container {
		font-family: 'Compagnon Medium', 'Compagnon-Roman', 'Courier', 'Cascadia Code', monospace;
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
		/* position: absolute; */
		/* line-height: 0.7; */
		/* top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) */
	}
</style>

<script lang="ts">
	import choose from '../../util/choose';
	import ngramList from '../../util/ngramList';
	import wordList from '../../util/wordList';
	import { onMount, onDestroy } from 'svelte';
	import { draw, crossfade, slide } from 'svelte/transition';
	import typewriter from '../../util/typewriter';
	import { Howl, Howler } from 'howler';
	// export const prerender = false; // disable ssr for this
	// export const ssr = false; // disable ssr for this

	// import type { PageData } from './$types';
	import RandomText from './RandomText.svelte';
	import HighlightWord from './HighlightWord.svelte';
	// import { requestTimeout } from '../../util/rafTimers';

	enum GameState {
		Loading,
		Starting,
		Guessing,
		Dead
	}

	import { difficulty, maxGuessingTime, musicVolume, sfxVolume } from '$lib/store.js';
	const maxDifficulty = 3;
	const undoGuessingTime = 3;
	const charSize = 40;
	let nChars = 720 / charSize; // this changes dynamically

	const alphabet = 'ABCDEFGGHIJKLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz';
	const xletters = 'X';

	let subset = ngramList.slice(
		Math.floor((ngramList.length / maxDifficulty) * ($difficulty - 1)),
		Math.floor((ngramList.length / maxDifficulty) * $difficulty)
	);
	const originalSubset = [...subset];
	
	let ngram: string;
	let ngramHistory: string[] = [];
	let hiddenWord: string;

	// Game state tracking
	let gameState = GameState.Loading;
	let deathTimer: number | NodeJS.Timeout;
	let deathIcon: string;

	// slowly walk down the ngram list
	const ngramWindow = 100; // how many words to choose from. Higher is less predictable.
	function clamp(min: number = -Infinity, max: number = Infinity, n: number) {
		return Math.min(max, Math.max(min, n))
	}
	const chooseNgram = () => {
		const ngramIndex = ngram ? subset.indexOf(ngram) : 0;
		const shift = gameState == GameState.Dead ? ngramWindow : ngramWindow / 5; // while they are losing, choose from easier words
		const start = clamp(0, subset.length - ngramWindow, ngramIndex - shift)
		const end = start + ngramWindow // this can never go over the length of the subset
		return choose(subset.slice(start, end)); // todo: convert to partial
	}

	const gameSounds = new Howl({
		src: ['sounds/gameSounds.webm', 'sounds/gameSounds.mp3'],
		sprite: {
			next: [0, 124.98866213151926],
			lose: [2000, 1457.1882086167802]
		},
		volume: $sfxVolume
	});

	const gameMusic = new Howl({
		src: ['sounds/gameMusic.webm', 'sounds/gameMusic.ogg', 'sounds/gameMusic.mp3'],
		loop: true,
		sprite: {
			loop: [0, 8000],
			loopTwo: [9000, 8000],
			loopThree: [18000, 8000],
			loose: [27000, 2000],
			win: [30000, 2000],
			buildup: [33000, 48000]
		},
		rate: 1.5,
		volume: $musicVolume
	});

	let musicId: number;

	function cancelDeathTimer() {
		if (deathTimer) clearTimeout(deathTimer);
	}
	function startDeathTimer(ms: number = $maxGuessingTime * 1000) {
		cancelDeathTimer();
		deathTimer = setTimeout(die, ms);
		return deathTimer;
	}
	function die() {
		cancelDeathTimer();
		hiddenWord = getWordForNgram(ngram);
		gameState = GameState.Dead;
		deathIcon = choose([':(', 'bye!', '🗿', '☠']);
		// gameSounds.play('lose');
		gameMusic.stop(musicId);
		musicId = gameMusic.play('loose');
		gameMusic.volume($sfxVolume, musicId);
		gameMusic.loop(false, musicId);
	}
	function load() {
		gameState = GameState.Starting;
	}
	function start() {
		gameMusic.stop(musicId)
		reset(false);
		nChars =
			Math.floor(Math.min(window?.innerWidth || 720, 720) / charSize / 1.4) - (ngram.length % 2);
			nChars += 1 - (nChars % 2);
		if ($musicVolume) {
			if (!gameMusic.playing(musicId)) musicId = gameMusic.play('buildup');
			gameMusic.on("end", () => gameMusic.play('loop'), musicId)
		}
	}
	function resume() {
		gameMusic.stop(musicId);
		if ($musicVolume)
			musicId = gameMusic.play(choose(['loop', 'loopTwo', 'loopThree']));
		reset();
	}
	function reset(withSound: boolean = true) {
		cancelDeathTimer();
		if (ngram) ngramHistory = [...ngramHistory, ngram];
		ngram = chooseNgram();
		// remove ngram from the subset so there are no repeats
		const indexToRemove = subset.indexOf(ngram)
		subset = [...subset.slice(0, indexToRemove), ...subset.slice(indexToRemove + 1)]
		// will they really keep playing after 2000+ ngrams? maybe. do them the courtesy
		if (subset.length < 2) subset = [...originalSubset]
		// nChars = nChars + ((nChars + ngram.length) % 2) * (1 - ((ngram.length % 2) * 2))
		gameState = GameState.Guessing;
		startDeathTimer();
		if (withSound) gameSounds.play('next');
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
		return choose(wordList.filter((word) => regexp.test(word)).slice(0, 10)); // yeuch.. maybe could be partial or called
	}

	function handleKeyup(e: KeyboardEvent) {
		if (e.key === ' ') reset();
	}

	onMount(() => {
		// reset(); // i.e. start
		gameMusic.stop(musicId);
		gameSounds.mute(false);
		gameMusic.mute(false);
		if (gameState == GameState.Loading) start();
		else reset(false);
	});
	onDestroy(() => {
		cancelDeathTimer();
		gameSounds.mute();
		gameMusic.mute();
		gameMusic.stop(musicId)
	});

	// TODO figure out the height stuff
</script>

<svelte:window on:keyup={handleKeyup} />

<div class="game-container">
	<a class="settings-button" href="game/settings">⚙</a>
	{#if gameState == GameState.Starting}
		<div class="start-container">
			<div class="button-container">
				<button class="defuse-button" on:click={start}>Start</button>
			</div>
		</div>
	{/if}
	{#if gameState == GameState.Guessing}
		<div class="play-area">
			<div class="hidden-word">??????</div>
			<div class="text-container">
				<RandomText length={nChars} letters={alphabet} />
				<br />
				<RandomText length={Math.floor((nChars - 3) / 2)} letters={alphabet} />{#key ngram}<span class="ngram" in:typewriter={{speed: 70}}
					>{ngram}</span
				>{/key}<RandomText
					length={nChars - 3 - Math.floor(Math.abs((nChars - 3) / 2))}
					letters={alphabet}
				/>
				<br />
				<RandomText length={nChars} letters={alphabet} />
				<!-- {#each Array(3) as _, i}
                {/each} -->
				<!-- {#each Array(3) as _, i}
                    {/each} -->
			</div>
			<div class="button-container">
				<button class="undo-button" on:click={undo} disabled={ngramHistory.length === 0}>←</button>
				<button class="defuse-button" on:mousedown={() => reset()}>Defuse</button>
			</div>
		</div>
		<div class="indicator">↓</div>
	{/if}
	{#if gameState == GameState.Dead}
		<div class="play-area">
			<div class="hidden-word"><HighlightWord word={hiddenWord} substring={ngram} /></div>
			<div class="text-container" class:bombed={gameState == GameState.Dead}>
				<RandomText length={nChars} letters={xletters} />
				<br />
				<RandomText length={Math.floor((nChars - 3) / 2)} letters={xletters} /><span class="ngram"
					>{ngram}</span
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
				<button class="undo-button" on:click={undo} disabled={ngramHistory.length === 0}>←</button>
				<button class="resume-button" on:click={resume}>Resume</button>
			</div>
		</div>
		<div class="indicator">{deathIcon}</div>
	{/if}
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
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
		color: #ddd;
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
		position: relative;
		text-align: center;
	}
	button {
		border: none;
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
	.start-container {
		position: absolute;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
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
	.play-area {
		padding: 3rem 0 1rem 0;
	}
	.indicator {
		height: 1.3em;
		font-size: 1.3em;
		justify-self: end;
		padding: 1rem 0 3rem 0;
	}
	.settings-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 2rem;
		color: gray;
		text-decoration: none;
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

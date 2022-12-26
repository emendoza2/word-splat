<script lang="ts">
	import { requestInterval } from '../../util/rafTimers';
	import { onDestroy, onMount, tick } from 'svelte';
	import choose from '../../util/choose';

	/** integer with length in chars of the random text */
	export let length: number;
	export let letters = 'ABCDEFGGHIJKLMNOPQRSTUVWXYZabcdefghijlmnopqrstuvwxyz';
	let randomLetters: string[];
	function listGenerator(length: number, fn: () => any) {
		if (length < 1) return [];
		return new Array(length).fill(null).map(fn);
	}
	const chooseRandomLetter = () => choose<string>(letters);
	$: randomLetters = (length > 0 && (length % 1) == 0) ? listGenerator(length, chooseRandomLetter) : [];
	function randomInt(start: number, end?: number) {
		if (!end) {
			(end = start), (start = 0);
		}
		return start + Math.floor(Math.random() * (end - start));
	}
	const mutateRandomLetter = (index: number) => (randomLetters[index] = chooseRandomLetter());

	async function draw() {
		await tick();
		const randomNumbers = listGenerator(randomInt(3), () => randomInt(length));
		randomNumbers.forEach(mutateRandomLetter); // side effects
		// randomLetters = randomLetters // side effects
		// requestAnimationFrame(draw)
	}

	let interval: number;
	onMount(() => {
		interval = requestInterval(draw, 500/length);
	});
    onDestroy(() => {
        if (interval) cancelAnimationFrame(interval);
    })
</script>

<span>{randomLetters.join('')}</span>

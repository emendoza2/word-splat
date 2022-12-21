export function requestInterval(fn: () => void, delay: number = 0): number {
	interface Handle {
		value: number | null;
	}
	let start = new Date().getTime(),
		handle: Handle = { value: null };
	function loop() {
		handle.value = requestAnimationFrame(loop);
		var current = new Date().getTime(),
			delta = current - start;
		if (delta >= delay) {
			fn.call(null);
			start = new Date().getTime();
		}
	}
	handle.value = requestAnimationFrame(loop);
	return handle.value;
}
export function requestTimeout(fn: () => void, timeout: number = 0): number {
	interface Handle {
		value: number | null;
	}
	let start = new Date().getTime(),
		handle: Handle = { value: null };
	function loop() {
		var current = new Date().getTime(),
		delta = current - start;
		if (delta >= timeout) {
			fn.call(null);
		} else {
			handle.value = requestAnimationFrame(loop);
		}
	}
	handle.value = requestAnimationFrame(loop);
	return handle.value;
}


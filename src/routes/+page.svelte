<div class="container">

    <h1>Word Game</h1>
    <p>Some word game meant to be played live</p>
    <a href="/game">Start</a>
</div>
<style>
    .container {
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
    a {
        display: inline-block;
		border-radius: 1rem;
        margin-top: 1rem;
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
	a:hover {
		cursor: pointer;
	}
	a:active {
		transform: translateY(0rem);
		box-shadow: none;
	}
	a:visited {
		color: inherit;
	}
</style>
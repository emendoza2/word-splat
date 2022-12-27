<svelte:head>
    <title>Word Splat</title>
    <link href="/fonts/fonts.css" rel="stylesheet" />
    <link rel="preload" href="/fonts/Compagnon-Bold.woff2" as="font" />
    <link rel="preload" href="/fonts/Compagnon-Medium.woff2" as="font" />
    <link rel="preload" href="/fonts/Compagnon-Roman.woff2" as="font" />
    <link rel="manifest" href="/manifest.json" />
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }
    </style>
</svelte:head>
<script>
	import { onMount } from "svelte";


    let loaded = false;
    function handleLoad() {
        console.log("laoded")
        loaded = true;
    }
    onMount(() => {
        if (document.readyState == "complete") {
            loaded = true
        }
    })
</script>
<svelte:window on:load={handleLoad} />
{#if !loaded}
<div id="preloader">
    <div id="container" class="container-preloader">
        <div class="animation-preloader">
            <div class="spinner"></div>
            <div class="txt-loading">
                LOADING
            </div>
        </div>
    </div>
</div>	
{/if}
{#if loaded}
<slot />
{/if}
<style>
    #preloader {
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }
</style>
<script lang="ts">
    export let word: string;
    export let substring: string | RegExp;
    const matcher = new RegExp(substring);
    const [ _, pre, highlight, post ] = word.match(new RegExp(`(.*)(${matcher.source})(.*)`, matcher.flags)) || []
</script>

{#if pre}<span>{pre}</span>{/if}<!--
-->{#if highlight}<span class="highlight">{highlight}</span>{/if}<!--
-->{#if post}<span>{post}</span>{/if}

<style>
    .highlight {
        text-decoration: underline;
    }
</style>
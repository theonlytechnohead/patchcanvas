<script lang="ts">
	import { store } from "../Sidebar.svelte";
	import { current, mode } from "../stores";

	export let showCanvases: boolean;

	const minimapWidth = window.innerWidth / 10;

	function rename() {
		let newName = prompt(undefined, $current.title);
		if (newName !== null) $current.title = newName;
	}
</script>

<div class="title">
	<h1 style="--window-width: {minimapWidth}">{$current.title}</h1>
	{#if $mode === undefined}
		<button on:click={rename}>✎ Rename</button>
	{/if}
</div>

<div class="buttons">
	{#if $mode === undefined}
		<button on:click={() => (showCanvases = !showCanvases)}>{showCanvases ? "🗄️ Protocols" : "📦 Canvases"}</button
		>
	{/if}
	<button on:click={() => store()}>💾 Save</button>
</div>

<style>
	.title {
		position: relative;
		& h1 {
			--window-width: 0;
			--minimap-width: calc(1px * var(--window-width));
			max-width: calc(100dvw - var(--minimap-width) - 30px - 2em);
			margin: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		& button {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			opacity: 0;

			font-size: larger;

			transition: opacity 0.2s ease-in-out;

			&:hover {
				opacity: 1;
			}
		}
	}
	.buttons {
		display: flex;
		gap: 0.5em;
		margin-top: 0.25em;

		& button {
			position: relative;
			padding-block: 0.5em;
		}
	}
</style>

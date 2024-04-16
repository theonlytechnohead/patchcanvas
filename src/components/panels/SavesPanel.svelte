<script lang="ts">
	import { get } from "svelte/store";
	import { downloadText } from "download.js";
	import { reset } from "../Sidebar.svelte";
	import { current, saves } from "../stores";

	export let showCanvases: boolean;

	let importFiles: FileList;
	function upload() {
		if (!importFiles[0]) return;

		let reader = new FileReader();
		reader.readAsText(importFiles[0]);
		reader.onload = (event: ProgressEvent<FileReader>) => {
			let data = JSON.parse(event.target?.result as string);
			load(data);
		};
	}

	export function load(data: any) {
		$current = data;
		$current.uniqueFlow = [{}];
	}

	function out() {
		let data = JSON.stringify(get(current));

		downloadText($current.title + ".patch", data);
	}
</script>

<h1>Canvases</h1>

<div class="buttons">
	<button on:click={() => (showCanvases = !showCanvases)}>Back</button>
	<button on:click={reset}>New</button>
	<button>
		Import
		<input
			type="file"
			accept=".patch"
			bind:files={importFiles}
			on:change={upload}
		/>
	</button>
	<button on:click={out}>Export</button>
</div>

<div class="current">
	<h2>Loaded</h2>
	<div class="save">
		<div class="title">
			<span class="name">{$current.title}</span>&nbsp;<span class="version">(v{$current.version})</span>
		</div>
		<div class="contents">
			{$current.nodes.length} nodes, {$current.edges.length} patches
		</div>
	</div>
</div>

<div class="saves">
	<h2>Stored</h2>
	{#if $saves.length === 0}
		<p>No canvases currently stored on this browser</p>
	{/if}
	{#each $saves as save (save)}
		<div class="save">
			{save}
		</div>
	{/each}
</div>

<style>
	h1,
	h2 {
		margin: 0;
	}
	h2 {
		font-weight: normal;
		margin-bottom: 0.25em;
	}
	.buttons {
		display: flex;
		gap: 0.5em;
		margin-top: 0.25em;

		& button {
			position: relative;
			flex-grow: 1;
			padding-block: 0.5em;

			& input[type="file"] {
				position: absolute;
				box-sizing: border-box;
				margin: -2px;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: calc(100% + 2px + 2px);
				height: calc(100% + 2px + 2px);
				opacity: 0;
			}
		}
	}
	.current, .saves {
		margin-top: 1em;
	}

	.saves > p {
		opacity: 0.65;
		font-size: 0.85em;
		font-style: italic;
	}

	.save {
		display: inline-block;
		border-radius: 0.5em;
		padding: 0.25em 0.5em;
		background-color: color-mix( in srgb, color-mix(in srgb, var(--font-colour) 50%, var(--background-colour) 50%) 25%, transparent 75% );

		& .title {
			& span.title {
				font-size: 1.25em;
				text-decoration: underline;
			}

			& span.version {
				opacity: 0.65;
				font-style: italic;
				text-decoration: unset;
			}
		}

		& .contents {
			font-size: 0.85em;
		}
	}
</style>
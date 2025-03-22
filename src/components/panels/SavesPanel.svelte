<script lang="ts">
	import { downloadText } from "download.js";
	import { reset } from "../Sidebar.svelte";
	import { current, mode, save, saves } from "../stores";
	import { get } from "svelte/store";

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
		$current = structuredClone(data);
		$current.uniqueFlow = [{}];
	}

	function out(data: typeof save) {
		downloadText($current.title + ".patch", JSON.stringify(data));
	}

	export function store(data: typeof save) {
		if (get(mode) === undefined) $saves[data.title] = structuredClone(data);
		else storeExternally(structuredClone(data));
	}

	function storeExternally(data: typeof save) {
		const m = get(mode);
		if (m === undefined) return;

		switch (m) {
			case "wpbc":
				const password = window.prompt("Password:");
				if (password === null || password !== "wpbc1") return;
				break;
		}

		const file = new File([JSON.stringify(data)], data.title + ".patch");
		const form = new FormData();
		form.append(m, file);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", "https://anderserver.ddns.net/patchcanvas/upload");
		xhr.onreadystatechange = (e) =>
			xhr.responseText && console.log(xhr.responseText);
		xhr.send(form);
	}

	function removeStore(name: string) {
		delete $saves[name];
		$saves = $saves;
	}
</script>

<h1>📦 Canvases</h1>

<div class="buttons">
	<button on:click={() => (showCanvases = !showCanvases)}>◀ Back</button>
	<button on:click={reset}>➕ New</button>
	<button>
		📂 Import
		<input
			type="file"
			accept=".patch"
			bind:files={importFiles}
			on:change={upload}
		/>
	</button>
</div>

<h2>Loaded</h2>
<div class="loaded">
	<div class="save current">
		<div class="title">
			<span class="name">{$current.title}</span>&nbsp;<span
				class="version">(v{$current.version})</span
			>
		</div>
		<div class="contents">
			{$current.nodes.length} nodes, {$current.edges.length} patches
		</div>
		<button on:click={() => store($current)}>💾 Save</button>
		<button on:click={() => out($current)}>📩 Export</button>
	</div>
</div>

<h2>Saved</h2>
<div class="saves">
	{#if Object.keys($saves).length === 0}
		<p>No canvases saved<br />(on this browser)</p>
	{/if}
	{#each Object.entries($saves) as [name, s] (name)}
		<div class="save {name === $current.title ? 'current' : ''}">
			<div class="title">
				<span class="name">{s.title}</span>&nbsp;<span class="version"
					>(v{s.version})</span
				>
			</div>
			<div class="contents">
				{s.nodes.length} nodes, {s.edges.length} patches
			</div>
			<button on:click={() => load(s)}>Load</button>
			<button on:click={() => out(s)}>Export</button>
			<button on:click={() => removeStore(name)}>Delete</button>
		</div>
	{/each}
</div>

<style>
	h1,
	h2 {
		margin: 0;
		margin-block-end: 0.25em;
	}
	h2 {
		font-weight: normal;
		margin-block-start: 0.5em;
		margin-block-end: 0.25em;
	}
	.buttons {
		display: flex;
		gap: 0.5em;
		margin-block-start: 0.25em;

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

	.saves {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5em;
	}

	.saves > p {
		margin: 0;
		opacity: 0.65;
		font-size: 0.85em;
		font-style: italic;
	}

	.save {
		display: inline-block;
		border-radius: 0.5em;
		padding: 0.25em 0.5em;
		background-color: color-mix(
			in srgb,
			color-mix(
					in srgb,
					var(--font-colour) 50%,
					var(--background-colour) 50%
				)
				25%,
			transparent 75%
		);

		&.current {
			outline: 0.1em solid limegreen;
		}

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
			margin-block-start: 0.125em;
		}

		& button {
			margin-block-start: 0.125em;
		}

		& button:first-of-type {
			font-size: 0.85em;
			margin-inline-start: -0.25em;
		}
	}
</style>

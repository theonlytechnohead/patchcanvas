<script lang="ts">
	import { get } from "svelte/store";
	import { downloadText } from "download.js";
	import { reset } from "../Sidebar.svelte";
	import { current } from "../stores";

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

<div class="buttons">
	<button on:click={() => showCanvases = !showCanvases}>Back</button>
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

<style>
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
</style>
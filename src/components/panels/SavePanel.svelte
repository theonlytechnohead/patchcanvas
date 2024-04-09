<script lang="ts">
	import { get } from "svelte/store";
	import { downloadText } from "download.js";
	import { save } from "../stores";
	import { reset } from "../Sidebar.svelte";

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
		$save = data;
		$save.uniqueFlow = [{}];
	}

	function rename() {
		let newName = prompt(undefined, $save.title);
		if (newName !== null) $save.title = newName;
	}

	function out() {
		let data = JSON.stringify(get(save));

		downloadText($save.title + ".patch", data);
	}
</script>

<div class="title">
	<h1>{$save.title}</h1>
	<button on:click={rename}>Rename</button>
</div>

<div class="buttons">
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
	.title {
		position: relative;
		& h1 {
			margin: 0;
		}
		& button {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			opacity: 0;

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

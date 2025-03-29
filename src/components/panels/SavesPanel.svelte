<script lang="ts">
	import { downloadText } from "download.js";
	import { reset } from "../Sidebar.svelte";
	import { current, mode, save, saves } from "../stores";
	import { get } from "svelte/store";

	let importFiles: FileList;
	function upload() {
		if (!importFiles[0]) return;

		let reader = new FileReader();
		reader.readAsText(importFiles[0]);
		reader.onload = (event: ProgressEvent<FileReader>) => {
			let data = JSON.parse(
				event.target?.result as string,
			) as typeof save;
			load(data);
		};
	}

	export function load(data: typeof save) {
		console.log("Loading", `${data.title}...`);
		current.set(structuredClone(data));
		console.log("Loaded, triggering update...");
		current.update((c) => ({ ...c, updated: true }));
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
		if (m === undefined) return false;

		authenticate(m).then((authenticated) => {
			if (!authenticated) {
				window.alert("Wrong password!");
				return;
			}

			const file = new File(
				[JSON.stringify(data)],
				data.title + ".patch",
			);
			const form = new FormData();
			form.append(m, file);

			const xhr = new XMLHttpRequest();
			xhr.open("POST", "https://anderserver.ddns.net/patchcanvas/upload");
			xhr.onload = () => {
				if (xhr.readyState === xhr.DONE) {
					window.alert(xhr.responseText);
				}
			};
			xhr.send(form);
		});
	}

	async function authenticate(m: string) {
		// Get password from user
		const password = window.prompt("Password:");
		// Early return if they don't put in a password
		if (password === null) return false;
		// Encode the password into a UTF-8 buffer
		const encodedPassword = new TextEncoder().encode(password);
		// Cryptographically hash the encoded password
		const hash = await window.crypto.subtle.digest(
			"SHA-256",
			encodedPassword,
		);
		// Decode the digest into a hex-string
		const decodedHash = [...new Uint8Array(hash)]
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");
		// Check the digest matches
		switch (m) {
			case "wpbc":
				return (
					decodedHash ===
					"7c9dcd8978a14a79431ed8c5a64a996c7e324246754adac2397b6d6f9dac65b1"
				);
		}
		return false;
	}

	function removeStore(name: string) {
		delete $saves[name];
		$saves = $saves;
	}
</script>

<h1>📦 Canvases</h1>

<div class="buttons">
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

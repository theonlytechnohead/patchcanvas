<script lang="ts">
	import {
		useUpdateNodeInternals,
		type NodeProps,
		useNodes,
		NodeResizeControl,
	} from "@xyflow/svelte";

	import "./nodes.css";

	const nodes = useNodes();

	import DragDots from "../../svg/drag-dots.svelte?raw";
	import ConnectionHandle from "../handles/ConnectionHandle.svelte";
	import { type ConnectionType } from "../connectionTypes";

	type $$Props = NodeProps;
	export let id: $$Props["id"];
	export let data: $$Props["data"];
	export let dragHandle: $$Props["dragHandle"];
	export let type: $$Props["type"];
	export let isConnectable: $$Props["isConnectable"];
	export let selected: $$Props["selected"];
	export let zIndex: $$Props["zIndex"];
	export let positionAbsoluteX: $$Props["positionAbsoluteX"];
	export let positionAbsoluteY: $$Props["positionAbsoluteY"];
	export let width: $$Props["width"] = undefined;
	export let height: $$Props["height"] = undefined;
	export let dragging: $$Props["dragging"] = false;
	export let sourcePosition: $$Props["sourcePosition"] = undefined;
	export let targetPosition: $$Props["targetPosition"] = undefined;

	id;
	data;
	dragHandle;
	type;
	isConnectable;
	selected;
	zIndex;
	positionAbsoluteX;
	positionAbsoluteY;
	width;
	height;
	dragging;
	sourcePosition;
	targetPosition;

	let inputDiv: HTMLDivElement;
	let outputDiv: HTMLDivElement;

	function validateNewConnectionHandle(
		existing: ConnectionType[],
		connection: ConnectionType,
	): boolean {
		return !existing.includes(connection);
	}

	const onDragEnter = (
		event: DragEvent,
		io: "input" | "output",
		div: any,
	) => {
		event.preventDefault();
		event.stopPropagation();
		if (!event.dataTransfer) {
			return null;
		}
		if (
			event.dataTransfer.types[0] === "application/patchcanvasconnection"
		) {
			const connection = event.dataTransfer.getData(
				"application/patchcanvasconnection",
			) as ConnectionType;
			let valid = false;
			switch (io) {
				case "input":
					valid = validateNewConnectionHandle(
						data.inputs,
						connection,
					);
					break;
				case "output":
					valid = validateNewConnectionHandle(
						data.outputs,
						connection,
					);
					break;
			}
			if (valid) {
				div.style = "background-color: green;";
				event.dataTransfer.dropEffect = "move";
			} else {
				div.style = "background-color: red;";
				event.dataTransfer.dropEffect = "none";
			}
		}
	};

	const onDragLeave = (event: DragEvent, div: any) => {
		event.preventDefault();
		div.style = "";
	};

	const onDrop = (event: DragEvent, io: "input" | "output", div: any) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		if (
			event.dataTransfer.types[0] === "application/patchcanvasconnection"
		) {
			const connection = event.dataTransfer.getData(
				"application/patchcanvasconnection",
			) as ConnectionType;
			let valid = false;
			switch (io) {
				case "input":
					valid = validateNewConnectionHandle(
						data.inputs,
						connection,
					);
					break;
				case "output":
					valid = validateNewConnectionHandle(
						data.outputs,
						connection,
					);
					break;
			}
			if (valid) {
				addConnection(connection, io);
			}
			div.style = "";
		}
	};

	const updateNodeInternals = useUpdateNodeInternals();
	function addConnection(connection: ConnectionType, io: string) {
		switch (io) {
			case "input":
				data.inputs.push(connection);
				// TODO: sorting doesn't update correctly
				// data.inputs.sort(sortTypes);
				break;
			case "output":
				data.outputs.push(connection);
				// TODO: sorting doesn't update correctly
				// data.outputs.sort(sortTypes);
				break;
		}
		data = data; // this is required for Svelte reactivity to work
		updateNodeInternals(id); // this is required for xyflow to know we've done something
	}

	function rename() {
		let old: string = data.label;
		data.label = prompt(`Rename '${data.label}' to:`, data.label);
		if (data.label === null) data.label = old;
	}

	function remove() {
		let confirm = window.confirm(`Actually delete ${data.label}?`);
		if (confirm) $nodes = $nodes.filter((n) => n.id != id);
	}
</script>

{#if !data.group}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="input-drop-target"
		bind:this={inputDiv}
		on:dragenter={(event) => onDragEnter(event, "input", inputDiv)}
		on:dragleave={(event) => onDragLeave(event, inputDiv)}
		on:drop={(event) => onDrop(event, "input", inputDiv)}
	></div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="output-drop-target"
		bind:this={outputDiv}
		on:dragenter={(event) => onDragEnter(event, "output", outputDiv)}
		on:dragleave={(event) => onDragLeave(event, outputDiv)}
		on:drop={(event) => onDrop(event, "output", outputDiv)}
	></div>
	<div class="hover"></div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style={data.labelStyle} class="label">
	<span class="drag-handle drag-dots">{@html DragDots}</span>
	{data.label}
	<button on:click={() => rename()} class="reverse">✎</button>
	<button on:click={() => remove()}>❌</button>
</div>

{#if data.group}
	<NodeResizeControl
		minWidth={200}
		minHeight={105}
		style="background: transparent; border: none;"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="15"
			height="15"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="var(--font-colour)"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			style="position: absolute; right: 0.5em; bottom: 0.5em;"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<polyline points="16 20 20 20 20 16" />
			<line x1="14" y1="14" x2="20" y2="20" />
			<polyline points="8 4 4 4 4 8" />
			<line x1="4" y1="4" x2="10" y2="10" />
		</svg>
	</NodeResizeControl>
{/if}

{#each data.inputs as connection, index}
	<ConnectionHandle
		id={connection}
		io="input"
		style="left: calc(12px + {connection === 'power'
			? '8'
			: data.inputs.includes('power') &&
				  data.inputs.indexOf('power') < data.inputs.indexOf(connection)
				? index - 1
				: index} * 16px);"
	/>
{/each}

{#each data.outputs as connection, index}
	<ConnectionHandle
		id={connection}
		io="output"
		style="left: calc(12px + 12px + {connection === 'power'
			? '7'
			: data.outputs.includes('power') &&
				  data.outputs.indexOf('power') <
						data.outputs.indexOf(connection)
				? index - 1
				: index} * 16px);"
	/>
{/each}

<style>
	.input-drop-target {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 10px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
	}

	.output-drop-target {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 10px;
		border-bottom-left-radius: 3px;
		border-bottom-right-radius: 3px;
	}

	.hover {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}

	.label {
		display: flex;
		justify-content: center;
		font-size: 12px;

		& button {
			padding: 0;
			padding-bottom: 0.2em;

			font-size: 0.9em;
			background: none;
			border: 0;
			opacity: 0;
			border-radius: 0.25em;
			transition: opacity 0.25s ease-in-out;

			&.reverse {
				transform: scaleX(-1);
				width: 1.25em;
				font-size: 1em;
				aspect-ratio: 1/1;
				margin-inline-start: 0.25em;
				padding: 0;
			}

			&:hover {
				background-color: color-mix(
					in srgb,
					var(--font-colour) 10%,
					transparent 90%
				);
			}
			&:active {
				background-color: color-mix(
					in srgb,
					var(--font-colour) 20%,
					transparent 80%
				);
			}
		}
	}
	:global(.svelte-flow__node:hover) .label button {
		opacity: 1;
	}
	:global(.svelte-flow__node .svelte-flow__resize-control svg) {
		opacity: 0;
		transition: opacity 0.25s ease-in-out;
	}
	:global(.svelte-flow__node:hover .svelte-flow__resize-control svg) {
		opacity: 0.5;

		&:hover {
			transition: opacity 0.1s ease-in-out;
			opacity: 1;
		}
	}
	.drag-dots {
		width: 0.5em;
		padding-inline: 0.25em;
		opacity: 0.6;
		&:hover,
		&:active {
			opacity: 1;
		}
		& svg {
			width: 100%;
			height: 110%;
		}
	}
</style>

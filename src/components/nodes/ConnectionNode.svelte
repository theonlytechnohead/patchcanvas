<script lang="ts">
	import { useUpdateNodeInternals, type NodeProps } from "@xyflow/svelte";

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

	if (data.connection && data.connection === "all") {
		if (!data.inputs.includes("dante")) data.inputs.push("dante");
		if (!data.inputs.includes("dmx")) data.inputs.push("dmx");
		if (!data.inputs.includes("ethernet")) data.inputs.push("ethernet");
		if (!data.inputs.includes("sdi")) data.inputs.push("sdi");
		if (!data.inputs.includes("audio")) data.inputs.push("audio");
		if (!data.inputs.includes("midi")) data.inputs.push("midi");
		if (!data.inputs.includes("osc")) data.inputs.push("osc");
		if (!data.inputs.includes("power")) data.inputs.push("power");

		if (!data.outputs.includes("dante")) data.outputs.push("dante");
		if (!data.outputs.includes("dmx")) data.outputs.push("dmx");
		if (!data.outputs.includes("ethernet")) data.outputs.push("ethernet");
		if (!data.outputs.includes("sdi")) data.outputs.push("sdi");
		if (!data.outputs.includes("audio")) data.outputs.push("audio");
		if (!data.outputs.includes("midi")) data.outputs.push("midi");
		if (!data.outputs.includes("osc")) data.outputs.push("osc");
	}
</script>

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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style={data.labelStyle} class="label">
	<span class="drag-handle drag-dots">{@html DragDots}</span>
	{data.label}
	<button on:click={() => rename()}>✎</button>
</div>

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
			transform: scaleX(-1);
			width: 1.25em;
			aspect-ratio: 1/1;
			padding: 0;
			margin-inline-start: 0.25em;
			font-size: 1em;
			background: none;
			border: 0;
			opacity: 0;
			border-radius: 0.25em;
			transition: opacity 0.25s ease-in-out;

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

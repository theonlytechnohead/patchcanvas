<script lang="ts">
	import { useUpdateNodeInternals, type NodeProps } from "@xyflow/svelte";

	import DragDots from "../../svg/drag-dots.svelte?raw";
	import ConnectionHandle from "../handles/ConnectionHandle.svelte";
	import type { ConnectionType } from "../connectionTypes";

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
				break;
			case "output":
				data.outputs.push(connection);
				break;
		}
		data = data; // this is required for Svelte reactivity to work
		updateNodeInternals(id); // this is required for xyflow to know we've done something
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style={data.labelStyle} class="label">
	<span class="drag-handle drag-dots">{@html DragDots}</span>{data.label}
</div>

{#each data.inputs as connection, index}
	<ConnectionHandle
		id={connection}
		io="input"
		style="left: calc(10% + {index}0%);"
	/>
{/each}

{#each data.outputs as connection, index}
	<ConnectionHandle
		id={connection}
		io="output"
		style="left: calc(15% + {index}0%);"
	/>
{/each}

{#if data.connection === "all"}
	<ConnectionHandle id="dante" io="input" style="left: 10%;" />
	<ConnectionHandle id="dmx" io="input" style="left:20%;" />
	<ConnectionHandle id="ethernet" io="input" style="left:30%;" />
	<ConnectionHandle id="sdi" io="input" style="left:40%;" />
	<ConnectionHandle id="audio" io="input" style="left:50%;" />
	<ConnectionHandle id="midi" io="input" style="left:60%;" />
	<ConnectionHandle id="osc" io="input" style="left:70%;" />
	<ConnectionHandle id="power" io="input" style="left: 95%;" />
	<ConnectionHandle id="dante" io="output" style="left: 15%;" />
	<ConnectionHandle id="dmx" io="output" style="left: 25%;" />
	<ConnectionHandle id="ethernet" io="output" style="left: 35%;" />
	<ConnectionHandle id="sdi" io="output" style="left: 45%;" />
	<ConnectionHandle id="audio" io="output" style="left: 55%;" />
	<ConnectionHandle id="midi" io="output" style="left: 65%;" />
	<ConnectionHandle id="osc" io="output" style="left: 75%;" />
{/if}

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

	.label {
		display: flex;
		justify-content: center;
		font-size: 12px;
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

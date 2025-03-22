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
	import PortHandle from "../handles/PortHandle.svelte";
	import {
		protocols,
		sortProtocols,
		type ProtocolType,
	} from "../protocolTypes";

	type $$Props = NodeProps;
	export let id: $$Props["id"];
	export let data: $$Props["data"] | Data;
	export let dragHandle: $$Props["dragHandle"] = undefined;
	export let type: $$Props["type"];
	export let isConnectable: $$Props["isConnectable"];
	export let selected: $$Props["selected"];
	export let selectable: $$Props["selectable"];
	export let deletable: $$Props["deletable"];
	export let draggable: $$Props["draggable"];
	export let parentId: $$Props["parentId"] = undefined;
	export let zIndex: $$Props["zIndex"];
	export let positionAbsoluteX: $$Props["positionAbsoluteX"];
	export let positionAbsoluteY: $$Props["positionAbsoluteY"];
	export let width: $$Props["width"] = undefined;
	export let height: $$Props["height"] = undefined;
	export let dragging: $$Props["dragging"] = false;
	export let sourcePosition: $$Props["sourcePosition"] = undefined;
	export let targetPosition: $$Props["targetPosition"] = undefined;

	id;
	let nodeData = data as Data;
	type Data = {
		label: string;
		inputs: ProtocolType[];
		outputs: ProtocolType[];
		group: boolean;
	};
	dragHandle;
	type;
	isConnectable;
	selected;
	selectable;
	deletable;
	draggable;
	parentId;
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

	function validateNewProtocol(
		existing: ProtocolType[],
		protocol: ProtocolType,
	): boolean {
		return !existing.includes(protocol);
	}

	const onDragEnter = (
		event: DragEvent,
		io: "input" | "output",
		div: HTMLDivElement,
	) => {
		event.preventDefault();
		event.stopPropagation();
		if (!event.dataTransfer) {
			return null;
		}
		if (event.dataTransfer.types[0].includes("patchcanvasprotocol/")) {
			const protocol = event.dataTransfer.types[0].replace(
				"patchcanvasprotocol/",
				"",
			) as ProtocolType;
			let valid = false;
			switch (io) {
				case "input":
					valid = validateNewProtocol(
						nodeData.inputs,
						protocol,
					);
					break;
				case "output":
					valid = validateNewProtocol(
						nodeData.outputs,
						protocol,
					);
					break;
			}
			if (valid) {
				updateBackground(
					[
						...(io === "input"
							? nodeData.inputs
							: nodeData.outputs),
						protocol,
					],
					div,
				);
				div.style.backgroundColor = "green";
				event.dataTransfer.dropEffect = "move";
			} else {
				div.style.backgroundColor = "red";
				div.style.backgroundImage = "";
				event.dataTransfer.dropEffect = "none";
			}
		}
	};

	const onDragLeave = (event: DragEvent, div: HTMLDivElement) => {
		event.preventDefault();
		div.style.backgroundColor = "";
		if (div === inputDiv) {
			updateBackground(nodeData.inputs, inputDiv);
		} else {
			updateBackground(nodeData.outputs, outputDiv);
		}
	};

	const onDrop = (
		event: DragEvent,
		io: "input" | "output",
		div: HTMLDivElement,
	) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		if (event.dataTransfer.types[0].includes("patchcanvasprotocol/")) {
			const protocol = event.dataTransfer.types[0].replace(
				"patchcanvasprotocol/",
				"",
			) as ProtocolType;
			let valid = false;
			switch (io) {
				case "input":
					valid = validateNewProtocol(
						nodeData.inputs,
						protocol,
					);
					break;
				case "output":
					valid = validateNewProtocol(
						nodeData.outputs,
						protocol,
					);
					break;
			}
			if (valid) {
				addProtocol(protocol, io);
			}
			div.style.backgroundColor = "";
			updateBackground(
				io === "input" ? nodeData.inputs : nodeData.outputs,
				div,
			);
		}
	};

	const eraserDrop = (event: DragEvent) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		if (event.dataTransfer.types[0] === "application/patchcanvaseraser") {
			if (
				(event.target as HTMLDivElement).attributes.getNamedItem(
					"data-nodeid",
				)?.value !== id
			)
				return null;
			let protocol = (
				event.target as HTMLDivElement
			).attributes.getNamedItem("data-handleid")?.value as ProtocolType;
			let io =
				(event.target as HTMLDivElement).attributes.getNamedItem(
					"data-handlepos",
				)?.value === "top"
					? "input"
					: "output";
			removeProtocol(protocol, io);
			updateBackground(
				io === "input" ? nodeData.inputs : nodeData.outputs,
				io === "input" ? inputDiv : outputDiv,
			);
		}
	};

	const updateNodeInternals = useUpdateNodeInternals();
	function addProtocol(protocol: ProtocolType, io: string) {
		switch (io) {
			case "input":
				nodeData.inputs.push(protocol);
				break;
			case "output":
				nodeData.outputs.push(protocol);
				break;
		}
		nodeData = nodeData; // this is required for Svelte reactivity to work
		updateNodeInternals(id); // this is required for xyflow to know we've done something
	}

	function rename() {
		let newName = prompt(`Rename '${nodeData.label}' to:`, nodeData.label);
		if (newName !== null) nodeData.label = newName;
	}

	function remove() {
		let confirm = window.confirm(`Actually delete ${nodeData.label}?`);
		if (confirm) $nodes = $nodes.filter((n) => n.id != id);
	}

	function updateBackground(handles: ProtocolType[], div: HTMLDivElement) {
		if (div === undefined || div === null) {
			setTimeout(updateBackground, 0, handles, div);
			return;
		}
		let currentHandles = [...handles];
		currentHandles.sort(sortProtocols);
		let colours = [];
		colours.push("transparent 2%");
		for (const connection in protocols) {
			let colour = "transparent";
			if (currentHandles.includes(connection)) {
				colour = protocols[connection][0];
			}
			let position = protocols[connection][1];
			if (div === outputDiv) {
				position += 0.75;
			}
			let percentage = ((position * 16) / 150) * 100;
			colour += ` ${percentage}%`;
			colours.push(colour);
		}
		colours.push("transparent");
		div.style.backgroundImage = `linear-gradient(to right, ${colours.join(", ")})`;
	}

	// required to avoid 'use before assignment' warning
	setTimeout(() => {
		updateBackground(nodeData.inputs, inputDiv);
		updateBackground(nodeData.outputs, outputDiv);
	}, 0);

	function removeProtocol(protocol: ProtocolType, io: string) {
		switch (io) {
			case "input":
				nodeData.inputs = nodeData.inputs.filter(
					(c: ProtocolType) => c !== protocol,
				);
				break;
			case "output":
				nodeData.outputs = nodeData.outputs.filter(
					(c: ProtocolType) => c !== protocol,
				);
				break;
		}
		nodeData = nodeData;
		updateNodeInternals(id);
	}
</script>

{#if !nodeData.group}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="drop-target inputs"
		bind:this={inputDiv}
		on:dragenter={(event) => onDragEnter(event, "input", inputDiv)}
		on:dragleave={(event) => onDragLeave(event, inputDiv)}
		on:drop={(event) => onDrop(event, "input", inputDiv)}
	></div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="drop-target outputs"
		bind:this={outputDiv}
		on:dragenter={(event) => onDragEnter(event, "output", outputDiv)}
		on:dragleave={(event) => onDragLeave(event, outputDiv)}
		on:drop={(event) => onDrop(event, "output", outputDiv)}
	></div>
	<div class="hover"></div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="label">
	<span class="drag-handle drag-dots">{@html DragDots}</span>
	{nodeData.label}
	<button on:click={() => rename()} class="reverse">✎</button>
	<button on:click={() => remove()}>❌</button>
</div>

{#if nodeData.group}
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

{#each nodeData.inputs as protocol (protocol)}
	<PortHandle id={protocol} io="input" drop={eraserDrop} />
{/each}

{#each nodeData.outputs as protocol (protocol)}
	<PortHandle id={protocol} io="output" drop={eraserDrop} />
{/each}

<style>
	.drop-target {
		opacity: 0.6;
		position: absolute;

		left: 0;
		right: 0;
		height: 10px;

		transition: background-color 0.25s ease-in-out;

		&.inputs {
			top: 0;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			mask: linear-gradient(to bottom, white, transparent);
		}

		&.outputs {
			bottom: 0;
			border-bottom-left-radius: 2px;
			border-bottom-right-radius: 2px;
			mask: linear-gradient(to top, white, transparent);
		}
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
		align-items: end;
		font-size: 12px;

		& button {
			height: 100%;
			aspect-ratio: 1/1;
			margin: 0;
			margin-inline-start: 0.15em;
			padding: 0;

			align-self: center;

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
			}

			&:hover {
				opacity: 1 !important;
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
		opacity: 0.5;
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

		padding-block-start: 0.15em;
		padding-inline: 0.25em;

		opacity: 0.6;

		align-self: stretch;

		&:hover,
		&:active {
			opacity: 1;
		}
		& svg {
			width: 100%;
			height: 100%;
		}
	}
</style>

<script lang="ts">
	import { type NodeProps } from "@xyflow/svelte";

	import DragDots from "../../svg/drag-dots.svelte?raw";
	import ConnectionHandle from "../handles/ConnectionHandle.svelte";

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
</script>

<div style={data.labelStyle} class="label">
	<span class="drag-handle drag-dots">{@html DragDots}</span>{data.label}
</div>

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
{#if data.connection === "power"}
	<ConnectionHandle id="power" io="output" style="left: 50%;" />
{/if}
{#if data.connection === "audio"}
	<ConnectionHandle id="audio" io="input" style="left: 50%;" />
{/if}

<style>
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

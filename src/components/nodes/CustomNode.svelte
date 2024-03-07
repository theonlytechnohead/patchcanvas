<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		useHandleConnections,
	} from "@xyflow/svelte";

	import DragDots from "../../svg/drag-dots.svelte?raw";

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
<Handle
	id="red"
	type="target"
	position={Position.Top}
	style="left:15%; background: red;"
	{isConnectable}
/>
<Handle
	id="blue"
	type="target"
	position={Position.Top}
	style="left:50%; background: blue;"
	{isConnectable}
/>
<Handle
	id="orange"
	type="target"
	position={Position.Top}
	style="left:85%; background: orange;"
	{isConnectable}
/>
<Handle
	id="red"
	type="source"
	position={Position.Bottom}
	style="left: 15%; background: red;"
	{isConnectable}
/>
<Handle
	id="blue"
	type="source"
	position={Position.Bottom}
	style="left: 50%; background: blue;"
	{isConnectable}
/>
<Handle
	id="orange"
	type="source"
	position={Position.Bottom}
	style="left: 85%; background: orange;"
	{isConnectable}
/>

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

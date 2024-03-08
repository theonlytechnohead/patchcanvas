<script lang="ts">
	import {
		getSmoothStepPath,
		type EdgeProps,
		useEdges,
		BaseEdge,
	} from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";

	type $$Props = EdgeProps;
	export let id: $$Props["id"];
	export let source: $$Props["source"];
	export let sourceX: $$Props["sourceX"];
	export let sourceY: $$Props["sourceY"];
	export let sourcePosition: $$Props["sourcePosition"];
	export let sourceHandleId: $$Props["sourceHandleId"] = "";
	export let target: $$Props["target"];
	export let targetX: $$Props["targetX"];
	export let targetY: $$Props["targetY"];
	export let targetPosition: $$Props["targetPosition"];
	export let targetHandleId: $$Props["targetHandleId"] = "";
	export let markerStart: $$Props["markerStart"] = undefined;
	export let markerEnd: $$Props["markerEnd"] = undefined;
	export let animated: $$Props["animated"] = false;
	export let selected: $$Props["selected"] = false;
	export let label: $$Props["label"] = "";
	export let labelStyle: $$Props["labelStyle"] = "";
	export let data: $$Props["data"] = undefined;
	export let interactionWidth: $$Props["interactionWidth"] = undefined;
	export let style: $$Props["style"] = "";

	export let edgeClass: $$Props["class"] = "";

	$: [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const edges = useEdges();
	const onEdgeClick = () =>
		edges.update((eds) => eds.filter((edge) => edge.id !== id));

	source;
	target;
	targetHandleId;
	animated;
	selected;
	label;
	labelStyle;
	data;
	interactionWidth;
	style += `stroke: ${connections[(sourceHandleId as ConnectionType) ?? ("" as ConnectionType)]};`;
</script>

<BaseEdge
	path={edgePath}
	{labelX}
	{labelY}
	{markerStart}
	{markerEnd}
	{style}
	class={edgeClass}
/>

<style>
	:global(.svelte-flow__edge) {
		transition: opacity 0.25s ease-in-out;
	}
	:global(.svelte-flow__edge-path) {
		transition: stroke-width 0.25s ease-in-out;
	}
	:global(svg:has(.highlight .svelte-flow__edge-path), svg:has(.selected .svelte-flow__edge-path)) {
		z-index: 1;
	}
	:global(.highlight .svelte-flow__edge-path) {
		stroke-width: 2;
	}
	:global(.selected .svelte-flow__edge-path) {
		transition: none;
		stroke-width: 2;
	}
	:global(.fade-out) {
		opacity: 0.5;
	}
</style>

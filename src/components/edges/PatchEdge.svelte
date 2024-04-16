<script lang="ts">
	import {
		getSmoothStepPath,
		type EdgeProps,
		useEdges,
		BaseEdge,
	} from "@xyflow/svelte";
	import { protocols, type ProtocolType } from "../protocolTypes";

	import "./edge.css";

	type $$Props = EdgeProps;
	export let id: $$Props["id"];
	export let type: $$Props["type"];
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

	const patches = useEdges();
	const onEdgeClick = () =>
		patches.update((eds) => eds.filter((edge) => edge.id !== id));

	type;
	source;
	target;
	targetHandleId;
	animated;
	selected;
	label;
	labelStyle;
	data;
	interactionWidth;
	$: {
		let colour =
			protocols[
				(sourceHandleId as ProtocolType) ?? ("" as ProtocolType)
			][0];
		style = `stroke: ${colour};`;
		markerEnd = `url(#${sourceHandleId})`;
	}
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

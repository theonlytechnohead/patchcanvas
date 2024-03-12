<script lang="ts">
	import { type MarkerProps } from "@xyflow/system";

	import { connections, type ConnectionType } from "../connectionTypes";

	type $$Props = MarkerProps;

	export let id: $$Props["id"];
	export let type: $$Props["type"];
	export let width: $$Props["width"] = 12.5;
	export let height: $$Props["height"] = 12.5;
	export let markerUnits: $$Props["markerUnits"] = "strokeWidth";
	export let orient: $$Props["orient"] = "auto-start-reverse";
	export let color: $$Props["color"] = undefined;
	export let strokeWidth: $$Props["strokeWidth"] = undefined;

	type;
	$: {
		color =
			connections[
				(id.replace("line", "") as ConnectionType) ??
					("" as ConnectionType)
			];
	}
</script>

<svg>
	<defs>
		<marker
			class="svelte-flow__arrowhead"
			{id}
			markerWidth={`${width}`}
			markerHeight={`${height}`}
			viewBox="-10 -10 20 20"
			{markerUnits}
			{orient}
			refX={id.includes("line") ? "4" : "0"}
			refY="0"
		>
			<polyline
				stroke={color}
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={strokeWidth}
				fill={color}
				points="-5,-4 0,0 -5,4 -5,-4"
			/>
		</marker>
	</defs>
</svg>

<style>
	svg {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>

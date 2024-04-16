<script lang="ts">
	import { Handle, Position } from "@xyflow/svelte";
	import { protocols, type ProtocolType } from "../protocolTypes";

	export let id: ProtocolType;
	export let io: string;
	export let style: string = "";
	export let drop: (event: DragEvent) => null | undefined;

	addEventListener("drop", drop);
</script>

<!-- it is necessary to manually set the width/height to a specific pixel value because Chrome can't render properly -->
<Handle
	{id}
	type={io === "input" ? "target" : "source"}
	position={io === "input" ? Position.Top : Position.Bottom}
	style={style +
		`background: ${protocols[id][0]};
		left: calc( ${io === "input" ? "" : "12px + "} (${protocols[id][1]}px * 16));
		border: none;
		width: 8px;
		height: 8px;`}
	isConnectable
/>

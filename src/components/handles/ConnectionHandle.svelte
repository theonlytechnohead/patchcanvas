<script lang="ts">
	import { Handle, Position } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";

	export let id: ConnectionType;
	export let io: string;
	export let style: string = "";
	export let drop: (event: DragEvent) => null | undefined

	addEventListener("drop", drop);
</script>

<!-- it is necessary to manually set the width/height to a specific pixel value because Chrome can't render properly -->
<Handle
	{id}
	type={io === "input" ? "target" : "source"}
	position={io === "input" ? Position.Top : Position.Bottom}
	style={style +
		`background: ${connections[id][0]};
		left: calc( ${io === "input" ? "" : "12px + "} (${connections[id][1]}px * 16));
		border: none;
		width: 8px;
		height: 8px;`}
	isConnectable
/>

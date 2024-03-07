<script lang="ts">
	import { Handle, Position } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";

	export let id: ConnectionType;
	export let io: string;
	export let style: string;
</script>

<Handle
	{id}
	type={io === "input" ? "target" : "source"}
	position={io === "input" ? Position.Top : Position.Bottom}
	style={style + `background: ${connections[id]};`}
	isConnectable
/>

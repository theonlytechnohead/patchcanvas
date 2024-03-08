<script lang="ts">
	import { useNodes, useUpdateNodeInternals } from "@xyflow/svelte";
	import type { ConnectionType } from "./connectionTypes";
	const nodes = useNodes();

	const updateNodeInternals = useUpdateNodeInternals();

	function addConnection(node: any, connection: ConnectionType) {
		node.data.connections.push(connection)
		node.data = node.data
		updateNodeInternals(node.id);
	}
</script>

{#each $nodes.filter((node) => node.selected) as node}
	<div>
		{node.data.label}: {node.data.connection}
		{node.data.connections}
		<button on:click={() => addConnection(node, "dante")}>+</button>
	</div>
{/each}

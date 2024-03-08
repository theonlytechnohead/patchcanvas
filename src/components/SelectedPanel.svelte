<script lang="ts">
	import { useNodes } from "@xyflow/svelte";
	const nodes = useNodes();
</script>

{#each $nodes.filter((node) => node.selected) as node}
	<div>
		{node.data.label}: {node.data.connections}
	</div>
{/each}

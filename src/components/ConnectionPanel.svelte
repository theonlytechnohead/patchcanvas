<script lang="ts">
	import { useEdges, useNodes } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "./connectionTypes";

	console.log(Object.entries(connections));

	const nodes = useNodes();
	const edges = useEdges();

	function getNodeName(id: string) {
		return $nodes.filter((node) => node.id == id)[0].data.label;
	}

	function highlightEdges(type: ConnectionType) {
		for (let edge of $edges) {
			if (edge.sourceHandle === type[0]) {
				edge.class += "highlight";
			} else {
				edge.class += "fade-out";
			}
		}
		$edges = $edges;
	}

	function unhighlightEdges(type: ConnectionType) {
		for (let edge of $edges) {
			if (edge.sourceHandle === type[0]) {
				edge.class = edge.class.replace("highlight", "");
			} else {
				edge.class = edge.class.replace("fade-out", "");
			}
		}
		$edges = $edges;
	}
</script>

{#each Object.entries(connections) as connection}
	<div
		style="--connection: {connection[1]};"
		on:mouseenter={() => highlightEdges(connection)}
		on:mouseleave={() => unhighlightEdges(connection)}
	>
		{connection[0]}
	</div>
{/each}

<!-- {#each $edges as edge}
	<div>
		Connection from {getNodeName(edge.source)}
		to {getNodeName(edge.target)}
		{edge.selected ? " - selected" : ""}
	</div>
{/each} -->

<style>
	div {
		padding-left: 0.5em;
		margin-block: 0.5em;

		border-bottom: 1px solid var(--connection);
		border-left: 0.25em solid var(--connection);

		transition: border-left-width 0.1s ease-out;

		&:hover {
			border-left-width: 1em;
		}
	}
</style>

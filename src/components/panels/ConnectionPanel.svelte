<script lang="ts">
	import { useEdges } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";

	const edges = useEdges();

	const iterableConnections: [ConnectionType, string][] = Object.entries(
		connections,
	) as [ConnectionType, string][];

	function highlightEdges(connection: ConnectionType) {
		for (let edge of $edges) {
			if (edge.sourceHandle === connection) {
				edge.class += "highlight";
			} else {
				edge.class += "fade-out";
			}
		}
		$edges = $edges;
	}

	function unhighlightEdges(connection: ConnectionType) {
		connection = connection as ConnectionType;
		for (let edge of $edges) {
			if (edge.sourceHandle === connection) {
				edge.class = edge.class?.replace("highlight", "");
			} else {
				edge.class = edge.class?.replace("fade-out", "");
			}
		}
		$edges = $edges;
	}

	const onDragStart = (event: DragEvent, connection: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/patchcanvasconnection", connection);
    event.dataTransfer.effectAllowed = "move";
  };
</script>

{#each iterableConnections as [connection, colour]}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		style="--connection: {colour};"
		on:mouseenter={() => highlightEdges(connection)}
		on:mouseleave={() => unhighlightEdges(connection)}
		on:dragstart={(event) => onDragStart(event, connection)}
		draggable={true}
	>
		{connection}
	</div>
{/each}

<style>
	div {
		padding-left: 0.5em;
		padding-block: 0.25em;

		border-bottom: 2px solid var(--connection);
		border-left: 0.5em solid var(--connection);

		transition: border-left-width 0.1s ease-out;

		&:hover {
			border-left-width: 1.25em;
		}
	}
</style>

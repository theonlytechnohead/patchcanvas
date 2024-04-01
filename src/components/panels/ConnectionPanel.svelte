<script lang="ts">
	import { useEdges } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";

	const edges = useEdges();

	const iterableConnections: [ConnectionType, [string, number]][] = Object.entries(
		connections,
	) as [ConnectionType, [string, number]][];

	function highlightEdges(connection: ConnectionType) {
		for (let edge of $edges) {
			if (edge.sourceHandle === connection) {
				edge.class += "highlight";
			} else {
				edge.class += "fade-out";
			}
		}
		$edges = $edges;
		for (let handle of document.querySelectorAll(".svelte-flow__handle")) {
			if (handle.getAttribute("data-handleid") === connection) {
				handle.classList.add("highlight");
			} else {
				handle.classList.add("fade-out");
			}
		}
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
		for (let handle of document.querySelectorAll(".svelte-flow__handle")) {
			if (handle.getAttribute("data-handleid") === connection) {
				handle.classList.remove("highlight");
			} else {
				handle.classList.remove("fade-out");
			}
		}
	}

	const onDragStart = (event: DragEvent, connection: string) => {
		if (!event.dataTransfer) {
			return null;
		}

		event.dataTransfer.setData(
			`patchcanvasconnection/${connection}`,
			"",
		);
		event.dataTransfer.effectAllowed = "move";
	};
</script>

{#each iterableConnections as [connection, value]}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		style="--connection: {value[0]};"
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

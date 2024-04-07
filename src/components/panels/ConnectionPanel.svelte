<script lang="ts">
	import { useEdges } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";
	import EraserIcon from "../../svg/eraser-icon.svelte?raw";

	const edges = useEdges();

	const iterableConnections: [ConnectionType, [string, number]][] =
		Object.entries(connections) as [ConnectionType, [string, number]][];

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

		event.dataTransfer.setData(`patchcanvasconnection/${connection}`, "");
		event.dataTransfer.effectAllowed = "move";
	};

	let eraser: HTMLDivElement;
	let clone: HTMLDivElement;
	const onEraserStart = (event: DragEvent) => {
		if (!event.dataTransfer) {
			return null;
		}

		event.dataTransfer.setData("application/patchcanvaseraser", "");
		event.dataTransfer.effectAllowed = "move";

		clone = eraser.cloneNode(true) as HTMLDivElement;
		clone.classList.add("dragging");
		clone.style.position = "absolute";
		clone.style.top = "0";
		clone.style.right = "0";
		clone.style.zIndex = "-1";
		document.body.appendChild(clone);
		event.dataTransfer?.setDragImage(clone, 0, 0);
	};

	const onEraserEnd = () => {
		clone.remove();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	bind:this={eraser}
	class="eraser"
	on:dragstart={(event) => onEraserStart(event)}
	on:dragend={onEraserEnd}
	draggable={true}
>
	{@html EraserIcon} erase
</div>
<div id="coverup"></div>

<div class="connections">
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
</div>

<style>
	.eraser {
		padding-left: 0.5em;
		padding-block: 0.25em;

		border-top: 2px solid var(--font-colour);
		border-left: 0.5em solid var(--font-colour);

		transition: border-left-width 0.1s ease-out;

		&:hover {
			border-left-width: 1.25em;
		}

		& svg {
			height: 1em;
		}

		&.dragging {
			border: none;
		}
	}
	.connections {
		margin-top: 1em;
	}
	.connections div {
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

<script lang="ts">
	import { Position, getSmoothStepPath, useConnection } from "@xyflow/svelte";
	import { connections, type ConnectionType } from "../connectionTypes";
	const connection = useConnection();
	let path = "";

	$: {
		let {
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition,
		} = $connection;
		[path] = getSmoothStepPath({
			sourceX: sourceX ?? 0,
			sourceY: sourceY ?? 0,
			sourcePosition: sourcePosition ?? Position.Bottom,
			targetX: targetX ?? 0,
			targetY: targetY ?? 0,
			targetPosition: targetPosition ?? Position.Top,
		});
	}
	let type: ConnectionType =
		($connection.startHandle?.handleId as ConnectionType) ??
		("" as ConnectionType);
</script>

{#if $connection.path}
	{#if $connection.startHandle?.type == "target"}
		<!-- draw arrow at start of path -->
		<path
			fill="none"
			stroke-width={1.5}
			class="animated"
			stroke={connections[type] ?? "var(--font-colour)"}
			d={path}
			marker-start="url(#{$connection.startHandle?.handleId}line)"
		/>
	{:else if $connection.startHandle?.type == "source"}
		<!-- draw arrow at start of path -->
		<path
			fill="none"
			stroke-width={1.5}
			class="animated"
			stroke={connections[type] ?? "var(--font-colour)"}
			d={path}
			marker-end="url(#{$connection.startHandle?.handleId}line)"
		/>
	{/if}
	<circle
		cx={$connection.targetX}
		cy={$connection.targetY}
		fill="var(--font-colour)"
		r={3}
		stroke={connections[type] ?? "var(--font-colour)"}
		stroke-width={1.5}
	/>
{/if}

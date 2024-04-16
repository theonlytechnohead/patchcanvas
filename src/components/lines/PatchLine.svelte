<script lang="ts">
	import { Position, getSmoothStepPath, useConnection } from "@xyflow/svelte";
	import { protocols, type ProtocolType } from "../protocolTypes";
	const patch = useConnection();
	let path = "";

	$: {
		let {
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition,
		} = $patch;
		[path] = getSmoothStepPath({
			sourceX: sourceX ?? 0,
			sourceY: sourceY ?? 0,
			sourcePosition: sourcePosition ?? Position.Bottom,
			targetX: targetX ?? 0,
			targetY: targetY ?? 0,
			targetPosition: targetPosition ?? Position.Top,
		});
	}
	let type: ProtocolType =
		($patch.startHandle?.handleId as ProtocolType) ??
		("" as ProtocolType);
</script>

{#if $patch.path}
	{#if $patch.startHandle?.type == "target"}
		<!-- draw arrow at start of path -->
		<path
			fill="none"
			stroke-width={1.5}
			class="animated"
			stroke={protocols[type][0] ?? "var(--font-colour)"}
			d={path}
			marker-start="url(#{$patch.startHandle?.handleId}line)"
		/>
	{:else if $patch.startHandle?.type == "source"}
		<!-- draw arrow at start of path -->
		<path
			fill="none"
			stroke-width={1.5}
			class="animated"
			stroke={protocols[type][0] ?? "var(--font-colour)"}
			d={path}
			marker-end="url(#{$patch.startHandle?.handleId}line)"
		/>
	{/if}
	<circle
		cx={$patch.targetX}
		cy={$patch.targetY}
		fill="var(--font-colour)"
		r={3}
		stroke={protocols[type][0] ?? "var(--font-colour)"}
		stroke-width={1.5}
	/>
{/if}

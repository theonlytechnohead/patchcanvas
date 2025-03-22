<script lang="ts">
	import { Position, getBezierPath, useConnection } from "@xyflow/svelte";
	import { protocols, type ProtocolType } from "../protocolTypes";

	const patch = useConnection();

	let path = "";

	$: {
		let {
			from,
			fromPosition,
			to,
			toPosition,
		} = $patch;
		[path] = getBezierPath({
			sourceX: from?.x ?? 0,
			sourceY: from?.y ?? 0,
			sourcePosition: fromPosition ?? Position.Bottom,
			targetX: to?.x ?? 0,
			targetY: to?.y ?? 0,
			targetPosition: toPosition ?? Position.Top,
		});
	}
	let type: ProtocolType =
		($patch.fromHandle?.id as ProtocolType) ?? ("" as ProtocolType);
</script>

{#if $patch.inProgress}
	{#if $patch.fromHandle?.type == "target"}
		<!-- draw arrow at start of path -->
		<path
			fill="none"
			stroke-width={1.5}
			class="animated"
			stroke={protocols[type][0] ?? "var(--font-colour)"}
			d={path}
			marker-start="url(#{$patch.fromHandle?.id}line)"
		/>
	{:else if $patch.fromHandle?.type == "source"}
		<!-- draw arrow at start of path -->
		<path
			fill="none"
			stroke-width={1.5}
			class="animated"
			stroke={protocols[type][0] ?? "var(--font-colour)"}
			d={path}
			marker-end="url(#{$patch.fromHandle?.id}line)"
		/>
	{/if}
	<circle
		cx={$patch.to?.x}
		cy={$patch.to?.y}
		fill="var(--font-colour)"
		r={3}
		stroke={protocols[type][0] ?? "var(--font-colour)"}
		stroke-width={1.5}
	/>
{/if}

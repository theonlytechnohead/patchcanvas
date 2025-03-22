<script lang="ts">
	import { iterableProtocols } from "../protocolTypes";
	import { current } from "../stores";
</script>

<div class="protocols">
	{#each iterableProtocols as [protocol, value]}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="protocol" style="--protocol: {value[0]};">
			<div class="icon">{@html value[2]}</div>
			{protocol}
		</div>
	{/each}
</div>

<h1>{$current.title}</h1>

<style>
	h1 {
		margin: 0;
		margin-top: 0.25em;
	}
	:global(.svelte-flow__panel:has(.protocols)) {
		right: 0;
	}
	.protocols {
		display: flex;
		justify-content: space-evenly;
	}
	.protocol {
		flex-grow: 1;
		position: relative;
		padding-inline: 0.5em;
		padding-block: 0.25em;

		border-bottom: 2px solid var(--protocol);
		border-left: 0.5em solid var(--protocol);

		& .icon {
			display: inline-block;
			width: 1em;

			& svg {
				position: absolute;
				height: 100%;
				top: 0;
				left: 0.25em;
			}
		}
	}
</style>

<script lang="ts">
	import { iterableProtocols } from "../protocolTypes";
</script>

<p>Key</p>

<div class="protocols">
	{#each iterableProtocols as [protocol, value]}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="protocol"
			style="--protocol: {value[0]};"
		>
			<div class="icon">{@html value[2]}</div>
			{protocol}
		</div>
	{/each}
</div>

<style>
	p {
		margin-top: 0;
		margin-bottom: 0.5em;
		font-style: italic;
		opacity: 0.65;
	}
	.protocols {
		margin-bottom: 0.5em;
	}
	.protocol {
		position: relative;
		padding-left: 0.5em;
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

	@media (max-aspect-ratio: 1/1) {
		p {
			margin-top: 0;
		}
	}
</style>

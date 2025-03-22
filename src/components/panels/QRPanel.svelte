<script lang="ts">
	import SvgQR from "@svelte-put/qr/svg/QR.svelte";

	const data = `https://patchcanvas.net${window.location.pathname}${window.location.search}`;
	const logo = "https://patchcanvas.net/favicon.ico";
</script>

<div class="container">
	<div class="qr">
		<SvgQR {data} {logo} />
	</div>

	<p>
		{data}
	</p>
</div>

<style>
	.container {
		display: flex;
		align-items: end;
		gap: 0.5em;
	}
	.qr {
		width: 3cm;
		height: 3cm;
	}
	p {
		margin: 0;
	}
</style>

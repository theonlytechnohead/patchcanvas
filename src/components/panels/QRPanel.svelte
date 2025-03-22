<script lang="ts">
	import SvgQR from "@svelte-put/qr/svg/QR.svelte";

	const data = `https://patchcanvas.net${window.location.pathname}${window.location.search}`;
	const logo =
		"https://patchcanvas.net/favicon.ico";
</script>

<div class="qr">
	<SvgQR {data} {logo} />
</div>

<style>
	.qr {
		width: 3cm;
	}
</style>

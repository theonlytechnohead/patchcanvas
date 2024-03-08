<script lang="ts">
  import NodePanel from "./NodePanel.svelte";
  import ConnectionPanel from "./ConnectionPanel.svelte"
</script>

<aside>
  <h1>PatchCanvas</h1>
  <NodePanel />
  <ConnectionPanel />
</aside>

<style>
  aside {
    padding: 1em;
    backdrop-filter: blur(0.5em);
    background-color: color-mix(
      in srgb,
      color-mix(in srgb, var(--font-colour) 25%, var(--background-colour) 75%)
        25%,
      transparent 75%
    );
  }
</style>

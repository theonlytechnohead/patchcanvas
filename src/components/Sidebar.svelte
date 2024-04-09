<script lang="ts" context="module">
  import { initialSave } from "./stores";

  let savePanel: SavePanel;
  export const reset = function () {
    if (savePanel)
      savePanel.load(initialSave);
  };
</script>

<script lang="ts">
  import NodePanel from "./panels/NodePanel.svelte";
  import ConnectionPanel from "./panels/ConnectionPanel.svelte";
  import SavePanel from "./panels/SavePanel.svelte";
</script>

<aside>
  <SavePanel bind:this={savePanel} />
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
    border: var(--xy-node-border-default);
    border-width: 0.14em;
    border-radius: calc(var(--xy-node-border-radius-default) * 2.5);
  }
</style>

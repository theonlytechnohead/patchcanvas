<script lang="ts" context="module">
  import { save } from "./stores";

  let savePanel: SavePanel;
  export const reset = function () {
    if (savePanel) savePanel.load(save);
  };
</script>

<script lang="ts">
  import NodePanel from "./panels/NodePanel.svelte";
  import ProtocolPanel from "./panels/ProtocolPanel.svelte";
  import SavePanel from "./panels/SavePanel.svelte";
</script>

<aside>
  <div>
    <SavePanel bind:this={savePanel} />
  </div>
  <div>
    <NodePanel />
  </div>
  <div class="rotate">
    <ProtocolPanel />
  </div>
</aside>

<style>
  :global(.svelte-flow__minimap) {
    transition: 0.5s opacity 0.2s ease-in-out;
  }
  :global(.svelte-flow__panel:has(aside)) {
    transition-property: margin, right;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    right: calc(100% - 15em);
  }

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

    transition-property: border-top-left-radius, border-top-right-radius;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
  }

  .rotate {
    width: 11em;
    transition: all 0.5s ease-in-out;
  }

  @media (max-aspect-ratio: 1/1) {
    :global(.svelte-flow__minimap) {
      opacity: 0;
      transition: 0.3s opacity 0.1s ease-in-out;
    }

    :global(.svelte-flow__panel:has(aside)) {
      margin: 0;
      right: 0;
    }

    aside {
      border-top-left-radius: 0;
      border-top-right-radius: 0;

      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1em;
    }

    .rotate {
      width: 7em;
      height: 8em;
      transform: rotateZ(-90deg);
    }
  }
</style>

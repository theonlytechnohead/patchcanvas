<script lang="ts" context="module">
  import { save } from "./stores";

  let savesPanel: SavesPanel;
  export const reset = function () {
    if (savesPanel) savesPanel.load(save);
  };
  export const store = function () {
    if (savesPanel) savesPanel.store(save);
  }
</script>

<script lang="ts">
  import NodePanel from "./panels/NodePanel.svelte";
  import ProtocolPanel from "./panels/ProtocolPanel.svelte";
  import CanvasPanel from "./panels/CanvasPanel.svelte";
  import SavesPanel from "./panels/SavesPanel.svelte";
  import { Panel } from "@xyflow/svelte";

  let showCanvases: boolean = false;
</script>

<Panel position={"top-left"} class="main">
  <aside class={showCanvases ? "hide" : ""}>
    <div>
      <CanvasPanel bind:showCanvases />
    </div>

    <div>
      <NodePanel />
    </div>
    <div class="rotate">
      <ProtocolPanel />
    </div>
  </aside>
</Panel>

<Panel position={"top-left"} class="saves">
  <aside class={showCanvases ? "show" : ""}>
    <div>
      <SavesPanel bind:showCanvases bind:this={savesPanel} />
    </div>
  </aside>
</Panel>

<style>
  :global(.svelte-flow__minimap) {
    transition: 0.5s opacity 0.2s ease-in-out;
  }
  :global(.svelte-flow__panel.main:has(aside)) {
    transition-property: margin, right, left;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    right: calc(100% - 15em);
  }

  :global(.svelte-flow__panel.main:has(aside.hide)) {
    left: -15em;
    right: 100%;
  }

  :global(.svelte-flow__panel.saves:has(aside)) {
    transition-property: top, bottom;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    top: -100%;
    bottom: 100%;
  }

  :global(.svelte-flow__panel.saves:has(aside.show)) {
    top: 0;
    bottom: 0;
  }

  :global(.svelte-flow__panel.saves aside) {
    max-height: 100%;
    overflow-y: auto;
  }

  aside {
    box-sizing: border-box;
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
    transition: transform 0.5s ease-in-out;
  }

  @media (max-aspect-ratio: 1/1) {
    :global(.svelte-flow__minimap) {
      opacity: 0;
      transition: 0.3s opacity 0.1s ease-in-out;
    }

    :global(.svelte-flow__panel.main:has(aside)) {
      margin: 0;
      right: 0;
    }

    :global(.svelte-flow__panel.main:has(aside.hide)) {
      left: -100%;
      right: 100%;
    }

    :global(.svelte-flow__panel.saves:has(aside)) {
      margin: 0;
      right: 0;
    }

    aside {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    :global(.svelte-flow__panel.main aside) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1em;
    }

    :global(.svelte-flow__panel.saves aside) {
      height: 100%;
    }

    .rotate {
      width: 7em;
      height: 8em;
      transform: rotateZ(-90deg);
    }
  }
</style>

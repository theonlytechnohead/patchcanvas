<script lang="ts" context="module">
  import { current, save } from "./stores";

  let savesPanel: SavesPanel;
  export const reset = function () {
    if (savesPanel) savesPanel.load(save);
  };
  export const store = function () {
    if (savesPanel) savesPanel.store(get(current));
  };
</script>

<script lang="ts">
  import { Panel } from "@xyflow/svelte";
  import { get } from "svelte/store";
  import NodePanel from "./panels/NodePanel.svelte";
  import ProtocolPanel from "./panels/ProtocolPanel.svelte";
  import CanvasPanel from "./panels/CanvasPanel.svelte";
  import SavesPanel from "./panels/SavesPanel.svelte";
  import KeyPanel from "./panels/KeyPanel.svelte";
  import QrPanel from "./panels/QRPanel.svelte";

  let showCanvases: boolean = false;
</script>

<Panel position={"top-left"} class="canvas">
  <aside>
    <div>
      <CanvasPanel bind:showCanvases />
    </div>
  </aside>
</Panel>

<Panel position={"top-left"} class="main">
  <aside class={showCanvases ? "hide" : ""}>
    <div class="nodes">
      <NodePanel />
    </div>
    <div class="rotate">
      <ProtocolPanel />
    </div>
  </aside>
</Panel>

<Panel position={"top-left"} class="key">
  <KeyPanel />
</Panel>

<Panel position={"bottom-left"} class="qr">
  <QrPanel />
</Panel>

<Panel position={"top-left"} class="saves">
  <aside class={showCanvases ? "show" : ""}>
    <div class="scroller">
      <SavesPanel bind:this={savesPanel} />
    </div>
  </aside>
</Panel>

<style>
  :global(.svelte-flow__minimap) {
    transition: 0.5s opacity 0.2s ease-in-out;
  }

  :global(.svelte-flow__panel.canvas:has(aside)) {
    /* Svelte Flow Panels are usually 5 */
    z-index: 6;
  }

  :global(.svelte-flow__panel.canvas aside) {
    height: 7em;
  }

  :global(.svelte-flow__panel.main:has(aside)) {
    top: 7.5em;
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
    top: 7.5em;
    bottom: 0;
  }

  :global(.svelte-flow__panel.saves aside) {
    max-height: 100%;
    display: flex;
    padding: 0;
    overflow: hidden;

    & .scroller {
      padding: 1em;
      /* only leave enough padding for the current save outline */
      padding-right: 0.1em;
      flex: 1;
      overflow-y: auto;
      scrollbar-gutter: stable;
    }
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

    transition-property: border-top-left-radius, border-top-right-radius,
      border-bottom-left-radius, border-bottom-right-radius;
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

    :global(.svelte-flow__panel.canvas:has(aside)) {
      margin: 0;
      right: 0;
    }

    :global(.svelte-flow__panel.canvas aside) {
      height: 6em;
    }

    :global(.svelte-flow__panel.main:has(aside)) {
      margin: 0;
      right: 0;
      top: 6em;
    }

    :global(.svelte-flow__panel.main:has(aside.hide)) {
      left: -100%;
      right: 100%;
    }

    :global(.svelte-flow__panel.main aside .nodes) {
      display: none;
    }

    :global(.svelte-flow__panel.main aside .eraser) {
      display: none;
    }

    aside {
      border-width: 0;
      border-radius: 0;
      padding-block: 0.5em;
    }

    :global(.svelte-flow__panel.saves:has(aside)) {
      margin: 0;
      right: 0;
    }

    :global(.svelte-flow__panel.saves:has(aside.show)) {
      top: 6em;
    }

    :global(.svelte-flow__panel.saves aside) {
      height: 100%;
      border-top: none;
      padding-right: 1em;
    }

    .rotate {
      width: 7em;
      height: 7em;
      transform: rotateZ(-90deg);
    }
  }
</style>

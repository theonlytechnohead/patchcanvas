<script lang="ts">
  import { writable } from "svelte/store";
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
  } from "@xyflow/svelte";

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css";
  import "./style/flow.css";

  // We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
  const nodes = writable([
    {
      id: "1",
      type: "input",
      data: { label: "Patch" },
      position: { x: 0, y: 0 },
    },
    {
      id: "2",
      type: "default",
      data: { label: "Canvas" },
      position: { x: 0, y: 150 },
    },
  ]);

  // same for edges
  const edges = writable([
    {
      id: "1-2",
      type: "default",
      source: "1",
      target: "2",
      label: "Connection",
    },
  ]);

  const snapGrid = [25, 25];
</script>

<main>
  <div style:height="100%">
    <SvelteFlow
      {nodes}
      {edges}
      {snapGrid}
      fitView
      on:nodeclick={(event) => console.log("on node click", event.detail.node)}
    >
      <Controls />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
    </SvelteFlow>
  </div>
</main>

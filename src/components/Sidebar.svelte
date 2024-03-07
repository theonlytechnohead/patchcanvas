<script lang="ts">
  import { useEdges, useNodes } from "@xyflow/svelte";
  import NodePanel from "./NodePanel.svelte";

  const nodes = useNodes();
  const edges = useEdges();

  function getNodeName(id: string) {
    return $nodes.filter((node) => node.id == id)[0].data.label;
  }
</script>

<aside>
  <h1>PatchCanvas</h1>
  <NodePanel />
  <!-- <p>Component list:</p>
  {#each $nodes as node}
    <div>
      {node.data.label}
      at ({node.position.x}, {node.position.y})
      {node.selected ? " - selected" : ""}
    </div>
  {/each}
  <p>Connection list:</p>
  {#each $edges as edge}
    <div>
      Connection from {getNodeName(edge.source)}
      to {getNodeName(edge.target)}
      {edge.selected ? " - selected" : ""}
    </div>
  {/each} -->
</aside>

<style>
  p {
    font-style: italic;
    margin-bottom: 0.25em;
    opacity: 0.65;
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
  }
</style>

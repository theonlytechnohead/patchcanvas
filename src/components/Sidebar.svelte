<script lang="ts">
  import { useEdges, useNodes } from "@xyflow/svelte";

  const nodes = useNodes();
  const edges = useEdges();

  function getNodeName(id: string) {
    return $nodes.filter((node) => node.id == id)[0].data.label;
  }
</script>

<aside>
  <p>Component list:</p>
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
      {edge.label}
      from {getNodeName(edge.source)}
      to {getNodeName(edge.target)}
      {edge.selected ? " - selected" : ""}
    </div>
  {/each}
</aside>

<style>
  p {
    font-style: italic;
    margin-bottom: 0.25em;
    opacity: 0.65;
  }
  aside {
    position: fixed;
    top: 4em;
    left: 1em;
  }
</style>
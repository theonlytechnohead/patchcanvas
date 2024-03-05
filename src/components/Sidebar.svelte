<script>
  import { useNodes } from "@xyflow/svelte";

  const nodes = useNodes();
</script>

<aside>
  {#each $nodes as node (node.id)}
    <div id={node.id}>
      {node.data.label}
      at ({node.position.x}, {node.position.y})
      {node.selected ? " - selected" : ""}
    </div>
  {/each}
</aside>

<script lang="ts">
  const onDragStart = (event: DragEvent, connection: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/patchcanvasnode", connection);
    event.dataTransfer.effectAllowed = "move";
  };
</script>

<p>Drag'n'drop the nodes!</p>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nodes">
  <div
    class="default-node node"
    on:dragstart={(event) => onDragStart(event, "all")}
    draggable={true}
  >
    tester
  </div>
  <div
    class="default-node node"
    on:dragstart={(event) => onDragStart(event, "")}
    draggable={true}
  >
    empty
  </div>
</div>

<style>
  p {
    font-style: italic;
    opacity: 0.65;
    margin-bottom: 0.5em;
  }

  .nodes {
    display: inline grid;
    gap: 0.5em;
  }

  .node {
    position: relative;
    cursor: grab;
    padding: 0.5em;
    border-radius: 0.25em;
    border: var(--font-colour) solid 0.1em;
    text-align: center;

    &.input-node {
      margin-top: 0.5em;
    }

    &.default-node {
      margin-block: 0.5em;
    }

    &.output-node {
      margin-bottom: 0.5em;
    }
  }

  .node::before,
  .node::after {
    content: "";
    display: inline-block;
    position: absolute;
    transform: translate(-50%, 50%);
    left: 50%;
    border-radius: 100%;
    background-color: var(--font-colour);
    width: 1em;
    height: 1em;
  }
  .node.default-node::before {
    top: -50%;
  }
  .node.default-node::after {
    bottom: 0;
  }
</style>

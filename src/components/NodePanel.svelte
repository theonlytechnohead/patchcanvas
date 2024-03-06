<script lang="ts">
  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/svelteflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
</script>

<p>You can drag these nodes to the pane below.</p>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nodes-container">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="input-node node"
    on:dragstart={(event) => onDragStart(event, "input")}
    draggable={true}
  >
    input node
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="default-node node"
    on:dragstart={(event) => onDragStart(event, "default")}
    draggable={true}
  >
    default node
  </div>
  <div
    class="output-node node"
    on:dragstart={(event) => onDragStart(event, "output")}
    draggable={true}
  >
    output node
  </div>
</div>

<style>
  p {
    font-style: italic;
    opacity: 0.65;
    margin-bottom: 0.25em;
  }

  .nodes-container {
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

    &.output-node {
      margin-top: 0.5em;
    }

    &.default-node {
      margin-block: 0.5em;
    }

    &.input-node {
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

  .node.input-node::before {
    width: 0;
    height: 0;
  }
  .node.input-node::after {
    bottom: 0;
  }

  .node.default-node::before {
    top: -50%;
  }
  .node.default-node::after {
    bottom: 0;
  }

  .node.output-node::before {
    top: -50%;
  }
  .node.output-node::after {
    width: 0;
    height: 0;
  }
</style>

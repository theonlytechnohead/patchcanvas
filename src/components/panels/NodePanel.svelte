<script lang="ts">
  const onDragStart = (event: DragEvent, data: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/patchcanvasnode", data);
    event.dataTransfer.effectAllowed = "move";
  };
</script>

<p>Drag to the canvas!</p>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="nodes">
  <div
    on:dragstart={(event) =>
      onDragStart(
        event,
        JSON.stringify({
          inputs: [],
          outputs: [],
        }),
      )}
    draggable={true}
  >
    node
  </div>
  <div
    on:dragstart={(event) =>
      onDragStart(
        event,
        JSON.stringify({
          group: true,
        }),
      )}
    draggable={true}
  >
    group
  </div>
</div>

<style>
  p {
    font-style: italic;
    opacity: 0.65;
    margin-top: 0;
    margin-bottom: 0.5em;

    transition: margin-top 0.5s ease-in-out;
  }

  .nodes {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.5em;
  }

  .nodes > * {
    flex-grow: 1;
    cursor: grab;
    padding: 0.5em;
    border-radius: 0.25em;
    border: var(--font-colour) solid 0.1em;
    text-align: center;
  }

  @media (max-aspect-ratio: 1/1) {
    p {
      margin-top: 0;
    }
  }
</style>

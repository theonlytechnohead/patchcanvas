<script lang="ts">
  import "@joint/core";
  import { onMount } from "svelte";
  import { connectors, dia, shapes } from "@joint/core";

  let ref;

  onMount(() => {
    var namespace = shapes;

    var graph = new dia.Graph({}, { cellNamespace: namespace });

    var paper = new dia.Paper({
      el: document.getElementById("holder"),
      model: graph,
      width: 600,
      height: 600,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: "rgba(0, 176, 255, 0.3)",
      },
      cellViewNamespace: namespace,
    });

    var rect = new shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
      body: {
        fill: "blue",
      },
      label: {
        text: "Hello",
        fill: "white",
      },
    });
    rect.addTo(graph);

    var rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr("label/text", "World!");
    rect2.addTo(graph);

    var link = new shapes.standard.Link();
    link.connector("curve", {
      direction: connectors.curve.Directions.AUTO,
      targetDirection: connectors.curve.TangentDirections.AUTO,
    });
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);
  });
</script>

<main class="app" bind:this={ref}>
  <div id="holder"></div>
</main>

<style>
</style>

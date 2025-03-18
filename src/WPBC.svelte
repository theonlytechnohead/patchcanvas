<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current, mode } from "./components/stores";
  import { onMount } from "svelte";

  mode.set("wpbc");

  onMount(() => {
    if ($mode === "wpbc") {
      // load the requested canvas
      const canvas = new URLSearchParams(window.location.search).get("canvas");
      if (canvas !== null && typeof canvas === "string" && 0 < canvas.length) {
        console.log("Requested canvas is:", canvas);
        // fetch the canvas from anderserver
        fetch(`https://anderserver.ddns.net/patchcanvas/wpbc/${canvas}.patch`)
          .then((r) => r.json())
          .then((c) => {
            console.log("Loaded requested canvas:", c);
            current.set(c);
          })
          .catch((e) => {
            console.log("Couldn't fetch requested canvas:", e);
          });
      }
    }
  });
</script>

<main>
  <div style:height="100%">
    <!-- https://svelteflow.dev/api-reference -->
    <SvelteFlowProvider>
      {#each $current.uniqueFlow as flow (flow)}
        <Canvas />
      {/each}
    </SvelteFlowProvider>
  </div>
</main>

<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current, mode } from "./components/stores";
  import { onMount } from "svelte";

  mode.set("wpbc");

  let loaded = false;

  onMount(() => {
    if ($mode === "wpbc" && !loaded) {
      // load the requested canvas
      const canvas = new URLSearchParams(window.location.search).get("canvas");
      if (canvas !== null && typeof canvas === "string" && 0 < canvas.length) {
        console.log("Requested canvas is:", canvas);
        // fetch the canvas from anderserver
        fetch(`https://anderserver.ddns.net/patchcanvas/wpbc/${canvas}.patch`)
          .then((r) => r.json())
          .then((c) => {
            console.log("Loaded requested canvas:", c);
            $current = structuredClone(c);
            $current.updated = true;
            console.log(
              "Load complete?",
              $current.nodes.length,
              $current.edges.length,
            );
            loaded = true;
          })
          .catch((e) => {
            console.log("Couldn't fetch requested canvas:", e);
            window.location.pathname = "/";
            window.location.search = "";
          });
      } else {
        window.location.pathname = "/";
      }
    }
  });
</script>

<main>
  <div style:height="100%">
    <!-- https://svelteflow.dev/api-reference -->
    <SvelteFlowProvider>
      {#if loaded}
        <Canvas />
      {/if}
    </SvelteFlowProvider>
  </div>
</main>

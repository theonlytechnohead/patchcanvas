<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current, mode, save } from "./components/stores";
  import { onMount, tick } from "svelte";

  mode.set("wpbc");

  let loaded = false;

  onMount(() => {
    if ($mode === "wpbc" && !loaded) {
      // load the requested canvas
      const canvas = new URLSearchParams(window.location.search).get("canvas");
      if (canvas !== null && typeof canvas === "string" && 0 < canvas.length) {
        console.log("Fetching", `${canvas}...`);
        // fetch the canvas from anderserver
        fetch(`https://anderserver.ddns.net/patchcanvas/wpbc/${canvas}.patch`)
          .then((r) => r.json())
          .then((c: typeof save) => {
            console.log("Fetched requested canvas, updating...");
            $current = structuredClone(c);
            if (c.mode !== $mode)
              throw new Error(`Fetched a save with an incorrect mode!\nWanted: ${$mode}, fetched: ${c.mode}`);
            tick()
              .then(() => ($current.updated = true))
              .then(() => (loaded = true))
              .then(() => console.log("Update complete!"));
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

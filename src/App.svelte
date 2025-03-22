<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current, mode, save, saves } from "./components/stores";
  import { get } from "svelte/store";

  // if state says we've got a save from a different mode, load the first save insteead
  if ($current.mode !== $mode) {
    const safeSaves = Object.values(get(saves)).filter(
      (save) => save.mode === $mode,
    );
    $current = structuredClone(safeSaves.length ? safeSaves[0] : save);
    $current.updated = true;
  }

  if (window.location.pathname !== "/") window.location.pathname = "/";
</script>

<main>
  <div style:height="100%">
    <!-- https://svelteflow.dev/api-reference -->
    <SvelteFlowProvider>
      <Canvas />
    </SvelteFlowProvider>
  </div>
</main>

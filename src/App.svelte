<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current, mode, save } from "./components/stores";

  // if state says we've got a save from a different mode, load the default instead
  if ($current.mode !== $mode) {
    $current = structuredClone(save);
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

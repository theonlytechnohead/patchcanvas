<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current } from "./components/stores";

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

<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Canvas from "./components/Canvas.svelte";
  import { current } from "./components/stores";
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

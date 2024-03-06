<script lang="ts">
  import { SvelteFlowProvider } from '@xyflow/svelte'
  import Flow from "./components/Flow.svelte"
</script>

<main>
  <div style:height="100%">
    <!-- https://svelteflow.dev/api-reference -->
    <SvelteFlowProvider>
      <Flow />
    </SvelteFlowProvider>
  </div>
</main>

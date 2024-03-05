<script lang="ts">
  import { writable } from "svelte/store";
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    ConnectionLineType,
    Panel,
    SvelteFlowProvider,
    ControlButton,
    type ColorMode,
  } from "@xyflow/svelte";

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css";
  import "./style/flow.css";
  import Sidebar from "./components/Sidebar.svelte";

  // We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
  const nodes = writable([
    {
      id: "1",
      type: "input",
      data: { label: "Patch" },
      position: { x: 0, y: 0 },
    },
    {
      id: "2",
      type: "default",
      data: { label: "Canvas" },
      position: { x: 0, y: 150 },
    },
  ]);

  // same for edges
  const edges = writable([
    {
      id: "1-2",
      type: "default",
      source: "1",
      target: "2",
      label: "Connection",
    },
  ]);

  let theme: ColorMode
  $: theme = document.documentElement.getAttribute("data-theme") as ColorMode ?? "dark" as ColorMode
</script>

<main>
  <div style:height="100%">
    <!-- https://svelteflow.dev/api-reference -->
    <SvelteFlowProvider>
      <SvelteFlow
        {nodes}
        {edges}
        snapGrid={[25, 25]}
        colorMode={theme}
        fitView
        minZoom={0.75}
        maxZoom={10}
        onlyRenderVisibleElements={true}
        connectionLineType={ConnectionLineType.SmoothStep}
        attributionPosition={"top-right"}
        on:nodeclick={(event) =>
          console.log("on node click", event.detail.node)}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap
        position={"top-right"}
        pannable={false}
        zoomable={false} 
        width={visualViewport?.width ? visualViewport?.width / 10 : undefined}
        height={visualViewport?.height ? visualViewport?.height / 10 : undefined}
        />
        <Controls
          position={"bottom-right"}
          showFitView={false}
          showLock={false}
        >
          <ControlButton
            on:click={() => {
              if (theme === "dark") {
                theme = "light"
              } else {
                theme = "dark"
              }
              document.documentElement.setAttribute("data-theme", theme)
              document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", theme)
            }}>🌙</ControlButton
          >
        </Controls>
        <Panel position={"top-left"}><h1>PatchCanvas</h1></Panel>
        <Panel position={"bottom-left"}><a href="https://github.com/theonlytechnohead/patchcanvas">GitHub</a><br>© 2024 Craig Anderson</Panel>
        <Sidebar />
      </SvelteFlow>
    </SvelteFlowProvider>
  </div>
</main>

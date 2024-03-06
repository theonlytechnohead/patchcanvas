<script lang="ts">
  import "@xyflow/svelte/dist/style.css";
  import "../style/flow.css";
  import { writable } from "svelte/store";
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    ConnectionLineType,
    Panel,
    ControlButton,
    useSvelteFlow,
    type ColorMode,
    type Node,
    type DefaultEdgeOptions,
    type FitViewOptions,
    type Viewport,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";

  // theming
  let theme: ColorMode;
  $: theme =
    (document.documentElement.getAttribute("data-theme") as ColorMode) ??
    ("dark" as ColorMode);

  const nodes = writable([
    {
      id: crypto.randomUUID().toString(),
      type: "input",
      data: { label: "Patch" },
      position: { x: 0, y: 0 },
    },
    {
      id: crypto.randomUUID().toString(),
      type: "output",
      data: { label: "Canvas" },
      position: { x: 0, y: 150 },
    },
  ]);

  const edges = writable([
    {
      id: crypto.randomUUID().toString(),
      type: "smoothstep",
      source: $nodes[0].id,
      target: $nodes[1].id,
    },
  ]);

  const defaultEdgeOptions = {
    animated: false,
    type: "smoothstep",
  } satisfies DefaultEdgeOptions;

  const fitViewOptions = {
    padding: 1,
    duration: 1000,
  } satisfies FitViewOptions;

  const { screenToFlowPosition } = useSvelteFlow();
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) {
      return null;
    }
    const type = event.dataTransfer.getData("application/svelteflow");
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = {
      id: `${Math.random()}`,
      type,
      position,
      data: { label: `${type} node` },
      origin: [0.5, 0.0],
    } satisfies Node;
    $nodes.push(newNode);
    $nodes = $nodes;
  };
</script>

<SvelteFlow
  {nodes}
  {edges}
  {defaultEdgeOptions}
  snapGrid={[25, 25]}
  colorMode={theme}
  fitView
  {fitViewOptions}
  minZoom={0.75}
  maxZoom={10}
  onlyRenderVisibleElements={true}
  connectionLineType={ConnectionLineType.SmoothStep}
  attributionPosition={"top-right"}
  deleteKey={"Delete"}
  on:dragover={onDragOver}
  on:drop={onDrop}
  on:nodeclick={(event) => console.log("on node click", event.detail.node)}
  on:edgeclick={(event) => console.log("on edge click: ", event.detail.edge)}
>
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap
    position={"top-right"}
    pannable={false}
    zoomable={false}
    width={visualViewport?.width ? visualViewport?.width / 10 : undefined}
    height={visualViewport?.height ? visualViewport?.height / 10 : undefined}
  />
  <Controls position={"bottom-right"} showFitView={false} showLock={false}>
    <ControlButton
      on:click={() => {
        if (theme === "dark") {
          theme = "light";
        } else {
          theme = "dark";
        }
        document.documentElement.setAttribute("data-theme", theme);
        document
          .querySelector('meta[name="color-scheme"]')
          ?.setAttribute("content", theme);
      }}>🌙</ControlButton
    >
  </Controls>
  <Panel position={"bottom-left"}
    ><a href="https://github.com/theonlytechnohead/patchcanvas">GitHub</a><br
    />© 2024 Craig Anderson</Panel
  >
  <Panel position={"top-left"}><Sidebar /></Panel>
</SvelteFlow>

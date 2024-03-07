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
    type EdgeProps,
    type NodeProps,
    type Connection,
    type Edge,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import CustomEdge from "./edges/CustomEdge.svelte";
  import type { ComponentType, SvelteComponent } from "svelte";
  import CustomNode from "./nodes/CustomNode.svelte";
  import CustomLine from "./lines/CustomLine.svelte";

  // theming
  let theme: ColorMode;
  $: theme =
    (document.documentElement.getAttribute("data-theme") as ColorMode) ??
    ("dark" as ColorMode);

  const nodeTypes = {
    default: CustomNode,
  } satisfies Record<string, ComponentType<SvelteComponent<NodeProps>>>;

  const edgeTypes = {
    custom: CustomEdge,
  } satisfies Record<string, ComponentType<SvelteComponent<EdgeProps>>>;

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
    {
      id: crypto.randomUUID().toString(),
      type: "default",
      data: { label: "Custom node" },
      dragHandle: ".drag-dots",
      position: { x: 200, y: 0 },
    },
    {
      id: crypto.randomUUID().toString(),
      type: "default",
      data: { label: "Custom node" },
      dragHandle: ".drag-dots",
      position: { x: 225, y: 125 },
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

  function validateConnection(connection: Edge | Connection): boolean {
    return connection.sourceHandle === connection.targetHandle;
  }

  const defaultEdgeOptions = {
    animated: false,
    type: "custom",
  } satisfies DefaultEdgeOptions;

  const fitViewOptions = {
    padding: 1,
    duration: 1000,
  } satisfies FitViewOptions;

  const { screenToFlowPosition } = useSvelteFlow();
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      // check the drop "target" and ensure that it is over the correct area (i.e. not a panel)
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const allowedTargets =
        ".svelte-flow__pane, .svelte-flow__node, .svelte-flow__edge";
      if (element?.matches(allowedTargets)) {
        event.dataTransfer.dropEffect = "move";
      } else {
        event.dataTransfer.dropEffect = "none";
      }
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
  {nodeTypes}
  {edges}
  {edgeTypes}
  {defaultEdgeOptions}
  isValidConnection={validateConnection}
  snapGrid={[25, 25]}
  colorMode={theme}
  fitView
  {fitViewOptions}
  minZoom={0.75}
  maxZoom={10}
  onlyRenderVisibleElements={true}
  attributionPosition={"top-right"}
  deleteKey={"Delete"}
  on:dragover={onDragOver}
  on:drop={onDrop}
  on:nodeclick={(event) => console.log("on node click", event.detail.node)}
  on:edgeclick={(event) => console.log("on edge click: ", event.detail.edge)}
>
  <CustomLine slot="connectionLine" />
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

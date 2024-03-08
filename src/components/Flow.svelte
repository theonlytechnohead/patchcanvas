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
    Panel,
    ControlButton,
    useSvelteFlow,
    type ColorMode,
    type DefaultEdgeOptions,
    type FitViewOptions,
    type EdgeProps,
    type NodeProps,
    type Connection,
    type Edge,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import ConnectionEdge from "./edges/ConnectionEdge.svelte";
  import type { ComponentType, SvelteComponent } from "svelte";
  import ConnectionNode from "./nodes/ConnectionNode.svelte";
  import ConnectionLine from "./lines/ConnectionLine.svelte";
  import type { ConnectionType } from "./connectionTypes";

  // theming
  let theme: ColorMode;
  $: theme =
    (document.documentElement.getAttribute("data-theme") as ColorMode) ??
    ("dark" as ColorMode);

  const nodeTypes = {
    default: ConnectionNode,
  } satisfies Record<string, ComponentType<SvelteComponent<NodeProps>>>;

  const edgeTypes = {
    connection: ConnectionEdge,
  } satisfies Record<string, ComponentType<SvelteComponent<EdgeProps>>>;

  const nodes = writable([
    {
      id: crypto.randomUUID().toString(),
      type: "default",
      data: { label: "Patch", connection: "", inputs: [], outputs: ["power"] },
      position: { x: 0, y: 0 },
    },
    {
      id: crypto.randomUUID().toString(),
      type: "default",
      data: { label: "tester", connection: "all", inputs: [], outputs: [] },
      dragHandle: ".drag-dots",
      position: { x: 0, y: 100 },
    },
  ]);

  const edges = writable([
    {
      id: crypto.randomUUID().toString(),
      type: "connection",
      class: "",
      source: $nodes[0].id,
      sourceHandle: "power",
      target: $nodes[1].id,
      targetHandle: "power",
    },
  ]);

  function validateConnection(connection: Edge | Connection): boolean {
    return connection.sourceHandle === connection.targetHandle;
  }

  const defaultEdgeOptions = {
    animated: false,
    type: "connection",
    class: "",
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
      let allowedTargets = "";
      switch (event.dataTransfer.types[0]) {
        case "application/patchcanvasnode":
          allowedTargets = ".svelte-flow__pane, .svelte-flow__edge";
          break;
        case "application/patchcanvasconnection":
          allowedTargets = ".input-drop-target, .output-drop-target";
          break;
      }
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
    if (event.dataTransfer.types[0] === "application/patchcanvasnode") {
      const connection = event.dataTransfer.getData(
        "application/patchcanvasnode",
      );
      addNode(connection, event.clientX, event.clientY);
    }
  };

  function addNode(name: string, x: number, y: number) {
    const position = screenToFlowPosition({
      x: x,
      y: y,
    });
    const newNode = {
      id: crypto.randomUUID().toString(),
      type: "default",
      position,
      data: {
        label: name,
        connection: name as ConnectionType,
        inputs: [],
        outputs: [],
      },
      dragHandle: ".drag-dots",
      origin: [0.5, 0.0],
    };
    $nodes.push(newNode);
    $nodes = $nodes;
  }
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
  <ConnectionLine slot="connectionLine" />
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

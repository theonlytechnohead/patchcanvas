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
    MarkerType,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import ConnectionEdge from "./edges/ConnectionEdge.svelte";
  import type { ComponentType, SvelteComponent } from "svelte";
  import ConnectionNode from "./nodes/ConnectionNode.svelte";
  import ConnectionLine from "./lines/ConnectionLine.svelte";
  import { type ConnectionType, connections } from "./connectionTypes";
  import ColouredMarker from "./markers/ColouredMarker.svelte";
  import { initialEdges, initialNodes } from "./nodes_and_edges";

  const iterableConnections: [ConnectionType, [string, number]][] = Object.entries(
    connections,
  ) as [ConnectionType, [string, number]][];

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

  const nodes = writable(initialNodes);
  const edges = writable(initialEdges);

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
      if (event.dataTransfer.types[0] === "application/patchcanvasnode") {
          allowedTargets =
            ".svelte-flow__pane, .svelte-flow__edge, .svelte-flow__node.group";
      } else if (event.dataTransfer.types[0].includes("patchcanvasconnection/")) {
          allowedTargets = ".drop-target";
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
      const data = JSON.parse(
        event.dataTransfer.getData("application/patchcanvasnode"),
      );
      addNode(data, event.clientX, event.clientY);
    }
  };

  function addNode(data: any, x: number, y: number) {
    const position = screenToFlowPosition({
      x: x,
      y: y,
    });
    const newNode = {
      id: crypto.randomUUID().toString(),
      type: "default",
      position,
      connectable: !data.group,
      data: {
        label: "Unnamed " + (!data.group ? "node" : "group"),
        group: data.group ?? false,
        inputs: data.inputs ?? [],
        outputs: data.outputs ?? [],
      },
      class: data.group ? "group" : undefined,
      dragHandle: ".drag-dots",
      origin: [0.5, 0.0] as [number, number],
    };
    $nodes.push(newNode);
    $nodes.sort((a, b) => {
      if (a.data.group) {
        if (b.data.group) {
          return 0;
        }
        return -1;
      }
      if (b.data.group) {
        return 1;
      }
      return 0;
    });
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
  {#each iterableConnections as [connection, value]}
    <ColouredMarker id={connection} type={MarkerType.ArrowClosed} />
  {/each}
  {#each iterableConnections as [connection, value]}
    <ColouredMarker id={connection + "line"} type={MarkerType.ArrowClosed} />
  {/each}
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

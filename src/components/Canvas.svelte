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
    type DefaultEdgeOptions,
    type FitViewOptions,
    type EdgeProps,
    type NodeProps,
    type Connection,
    type Edge,
    MarkerType,
    type Node,
  } from "@xyflow/svelte";
  import Sidebar, { reset } from "./Sidebar.svelte";
  import PatchEdge from "./edges/PatchEdge.svelte";
  import { type ComponentType, type SvelteComponent } from "svelte";
  import ConnectionNode from "./nodes/ConnectionNode.svelte";
  import PatchLine from "./lines/PatchLine.svelte";
  import { iterableProtocols } from "./protocolTypes";
  import ColouredMarker from "./markers/ColouredMarker.svelte";
  import { get } from "svelte/store";
  import { LATEST_SAVE, preferences, current } from "./stores";
  import { initialEdges, initialNodes } from "./nodes_and_edges";
  import lodash from "lodash";

  if ($current.version != LATEST_SAVE) {
    console.log("Version mismatch: " + $current.version + " != " + LATEST_SAVE);

    if (
      $current.nodes.length === initialNodes.length &&
      $current.edges.length === initialEdges.length &&
      $current.nodes.every((value, index, array) => {
        return lodash.isMatch(value, initialNodes[index]);
      }) &&
      $current.edges.every((value, index, array) => {
        return lodash.isMatch(value, initialEdges[index]);
      })
    ) {
      console.log("Still default, updating without confirmation");
      setTimeout(() => {
        reset();
      }, 0);
    } else {
      console.log("Edited, prompt for confirmation");
      let confirmConvert = confirm(
        `Your canvas is out of date\nDo you want to update to the latest version?\n(v${$current.version} -> v${LATEST_SAVE})`,
      );
      if (confirmConvert) {
        // TODO: convert!
      }
    }
  } else {
    console.log("Using latest save version: " + $current.version);
  }

  // theming
  document.documentElement.setAttribute("data-theme", $preferences.theme);
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute("content", $preferences.theme);

  // print-preview keyboard shortcut
  document.documentElement.setAttribute("print-preview", String(false));
  document.addEventListener("keyup", (e) => {
    if (e.code === "KeyP") {
      const previewing =
        document.documentElement.getAttribute("print-preview") === String(true);
      document.documentElement.setAttribute("print-preview", `${!previewing}`);
    }
  });

  const nodeTypes = {
    default: ConnectionNode,
  } satisfies Record<string, ComponentType<SvelteComponent<NodeProps>>>;

  const edgeTypes = {
    connection: PatchEdge,
  } satisfies Record<string, ComponentType<SvelteComponent<EdgeProps>>>;

  // deep-copy the current save nodes & edges to initialise properly
  const nodes = writable(structuredClone(get(current).nodes));
  const edges = writable(structuredClone(get(current).edges));

  $: {
    $current.nodes = $nodes;
    $current.edges = $edges;
  }

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
      } else if (event.dataTransfer.types[0].includes("patchcanvasprotocol/")) {
        allowedTargets = ".drop-target";
      } else if (
        event.dataTransfer.types[0] === "application/patchcanvaseraser"
      ) {
        allowedTargets = ".svelte-flow__handle";
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
    $nodes.sort((a: Node, b: Node) => {
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

  function exitFullscreen(this: Document, event: Event) {
    if (!document.fullscreenElement) {
      document
        .querySelector('[media="screen"]')
        ?.setAttribute("media", "print");
    }
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
  colorMode={$preferences.theme}
  fitView
  {fitViewOptions}
  minZoom={0.75}
  maxZoom={10}
  onlyRenderVisibleElements={true}
  attributionPosition={"top-right"}
  deleteKey={"Delete"}
  on:dragover={onDragOver}
  on:drop={onDrop}
  on:nodeclick={(event) => console.log("Node clicked:", event.detail.node)}
  on:edgeclick={(event) => console.log("Edge clicked:", event.detail.edge)}
>
  {#each iterableProtocols as [protocol, value] (value[1])}
    <ColouredMarker id={protocol} type={MarkerType.ArrowClosed} />
  {/each}
  {#each iterableProtocols as [protocol, value] (value[1])}
    <ColouredMarker id={protocol + "line"} type={MarkerType.ArrowClosed} />
  {/each}
  <PatchLine slot="connectionLine" />
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
      on:click={function () {
        document
          .querySelector('[media="print"]')
          ?.setAttribute("media", "screen");
        document.addEventListener("fullscreenchange", exitFullscreen);
        document.documentElement.requestFullscreen();
      }}>⛶</ControlButton
    >
    <ControlButton
      on:click={() => {
        if ($preferences.theme === "dark") {
          $preferences.theme = "light";
        } else {
          $preferences.theme = "dark";
        }
        document.documentElement.setAttribute("data-theme", $preferences.theme);
        document
          .querySelector('meta[name="color-scheme"]')
          ?.setAttribute("content", $preferences.theme);
      }}>🌙</ControlButton
    >
  </Controls>
  <Panel position={"bottom-left"}
    ><a href="https://github.com/theonlytechnohead/patchcanvas">GitHub</a><br
    />© 2024 Craig Anderson</Panel
  >
  <Sidebar />
</SvelteFlow>

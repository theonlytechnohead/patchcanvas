import type { Edge, Node } from "@xyflow/svelte";


export const initialNodes: Node[] = [
	{
		id: crypto.randomUUID().toString(),
		type: "default",
		data: {
			label: "Patch",
			connection: "",
			inputs: [],
			outputs: ["ethernet", "sdi", "audio", "power"],
		},
		position: { x: 0, y: 0 },
	},
	{
		id: crypto.randomUUID().toString(),
		type: "default",
		data: { label: "Canvas", connection: "all", inputs: [], outputs: [] },
		dragHandle: ".drag-dots",
		position: { x: 0, y: 100 },
	},
]

export const initialEdges: Edge[] = [
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[0].id,
		sourceHandle: "ethernet",
		target: initialNodes[1].id,
		targetHandle: "ethernet",
	},
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[0].id,
		sourceHandle: "sdi",
		target: initialNodes[1].id,
		targetHandle: "sdi",
	},
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[0].id,
		sourceHandle: "audio",
		target: initialNodes[1].id,
		targetHandle: "audio",
	},
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[0].id,
		sourceHandle: "power",
		target: initialNodes[1].id,
		targetHandle: "power",
	},
]
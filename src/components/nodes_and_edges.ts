import type { Edge, Node } from "@xyflow/svelte";


export const initialNodes: Node[] = [
	{
		id: crypto.randomUUID().toString(),
		data: { label: "Group", inputs: [], outputs: [], group: true },
		class: "group",
		dragHandle: ".drag-dots",
		position: { x: 200, y: 0 }
	},
	{
		id: crypto.randomUUID().toString(),
		type: "default",
		data: {
			label: "Patch",
			connection: "",
			inputs: [],
			outputs: ["ethernet", "sdi", "audio", "power"],
			group: false
		},
		position: { x: 0, y: 0 },
	},
	{
		id: crypto.randomUUID().toString(),
		type: "default",
		data: {
			label: "Canvas",
			inputs: [
				"dante",
				"dmx",
				"ethernet",
				"sdi",
				"audio",
				"midi",
				"osc",
				"power"
			], outputs: [
				"dante",
				"dmx",
				"ethernet",
				"sdi",
				"audio",
				"midi",
				"osc"
			]
		},
		dragHandle: ".drag-dots",
		position: { x: 0, y: 100 },
	},
	{
		id: crypto.randomUUID().toString(),
		type: "default",
		data: { label: "Subnode", connection: "", inputs: ["dante", "power"], outputs: ["dante"], group: false },
		dragHandle: ".drag-dots",
		position: { x: 225, y: 50 },
	}
]

export const initialEdges: Edge[] = [
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[1].id,
		sourceHandle: "ethernet",
		target: initialNodes[2].id,
		targetHandle: "ethernet",
	},
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[1].id,
		sourceHandle: "sdi",
		target: initialNodes[2].id,
		targetHandle: "sdi",
	},
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[1].id,
		sourceHandle: "audio",
		target: initialNodes[2].id,
		targetHandle: "audio",
	},
	{
		id: crypto.randomUUID().toString(),
		type: "connection",
		class: "",
		source: initialNodes[1].id,
		sourceHandle: "power",
		target: initialNodes[2].id,
		targetHandle: "power",
	},
]
import { persisted } from "svelte-persisted-store";
import { initialEdges, initialNodes } from "./nodes_and_edges";
import type { ColorMode } from "@xyflow/svelte";

export const initialPreferences = {
	theme: "dark" as ColorMode
}
export const preferences = persisted("preferences", initialPreferences)


export const initialSave = {
	uniqueFlow: [{}], // every {} is fully unique, i.e. {} === {} evaluates to false
	title: "PatchCanvas",
	nodes: initialNodes,
	edges: initialEdges
}
export const save = persisted("save", initialSave)

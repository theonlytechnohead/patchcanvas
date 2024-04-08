import { persisted } from "svelte-persisted-store";
import { initialEdges, initialNodes } from "./nodes_and_edges";

export const initialSave = {
	uniqueFlow: [{}], // every {} is fully unique, i.e. {} === {} evaluates to false
	title: "PatchCanvas",
	nodes: initialNodes,
	edges: initialEdges
}
export const save = persisted("save", initialSave)

import { persisted } from "svelte-persisted-store";
import { initialEdges, initialNodes } from "./nodes_and_edges";
import type { ColorMode } from "@xyflow/svelte";

export const LATEST_PREFERENCES = 1;
export const LATEST_SAVE = 1;

export const initialPreferences = {
	version: LATEST_PREFERENCES,
	theme: "dark" as ColorMode
}
export const preferences = persisted("preferences", initialPreferences)


export const save = {
	version: LATEST_SAVE,
	uniqueFlow: [{}], // every {} is fully unique, i.e. {} === {} evaluates to false
	title: "PatchCanvas",
	nodes: initialNodes,
	edges: initialEdges
}
export const current = persisted("current", save)

export const initialSaves: { [name: string]: typeof save } = {}
export const saves = persisted("saves", initialSaves)
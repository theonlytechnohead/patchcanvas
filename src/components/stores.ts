import { persisted } from "svelte-persisted-store";
import { initialEdges, initialNodes } from "./nodes_and_edges";
import type { ColorMode } from "@xyflow/svelte";
import { writable } from "svelte/store";

export const LATEST_PREFERENCES = 1;
export const LATEST_SAVE = 1;

export const initialPreferences = {
	version: LATEST_PREFERENCES,
	theme: "dark" as ColorMode
}
export const preferences = persisted("preferences", structuredClone(initialPreferences))


export const save = {
	version: LATEST_SAVE,
	updated: false,
	title: "PatchCanvas",
	nodes: initialNodes,
	edges: initialEdges
}

export const current = persisted("current", structuredClone(save))

export const initialSaves: { [name: string]: typeof save } = {}
export const saves = persisted("saves", structuredClone(initialSaves))

/** Mode for loading fixed patchcanvases, e.g. from anderserver for WPBC */
export const mode = writable<"wpbc" | undefined>()

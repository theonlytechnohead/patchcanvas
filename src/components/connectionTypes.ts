export type ConnectionType = "power" | "dante" | "dmx" | "ethernet" | "sdi" | "audio" | "midi" | "osc"

// https://stackoverflow.com/questions/21687907/typescript-sorting-an-array
export const connections: { [type in ConnectionType]: string } = {
	"power": "var(--font-colour)",
	"dante": "red",
	"dmx": "dodgerblue",
	"ethernet": "gold",
	"sdi": "limegreen",
	"audio": "orange",
	"midi": "hotpink",
	"osc": "magenta"
}

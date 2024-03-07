export type ConnectionType = "power" | "dante" | "dmx" | "ethernet" | "sdi" | "audio" | "midi" | "osc"

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
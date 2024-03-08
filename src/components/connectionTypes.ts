const ALL_CONNECTIONS = ["power",
	"dante",
	"dmx",
	"ethernet",
	"sdi",
	"audio",
	"midi",
	"osc"]
type Connection = typeof ALL_CONNECTIONS;
export type ConnectionType = Connection[number]

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

export function sortTypes(t1: ConnectionType, t2: ConnectionType): number {
	let i1 = ALL_CONNECTIONS.indexOf(t1);
	let i2 = ALL_CONNECTIONS.indexOf(t2);
	let direction = Math.sign(i1 - i2);
	return direction;
}
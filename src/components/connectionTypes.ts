const ALL_CONNECTIONS = [
	"dante",
	"dmx",
	"sdi",
	"ethernet",
	"audio",
	"midi",
	"osc",
	"power"]
type Connection = typeof ALL_CONNECTIONS;
export type ConnectionType = Connection[number]

// https://stackoverflow.com/questions/21687907/typescript-sorting-an-array
export const connections: { [type in ConnectionType]: [string, number] } = {
	"dante": ["red", 1],
	"dmx": ["dodgerblue", 2],
	"sdi": ["limegreen", 3],
	"ethernet": ["gold", 4],
	"audio": ["orange", 5],
	"midi": ["hotpink", 6],
	"osc": ["magenta", 7],
	"power": ["var(--font-colour)", 8]
}

export function sortTypes(t1: ConnectionType, t2: ConnectionType): number {
	let i1 = ALL_CONNECTIONS.indexOf(t1);
	let i2 = ALL_CONNECTIONS.indexOf(t2);
	let direction = Math.sign(i1 - i2);
	return direction;
}
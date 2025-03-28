import Audio from "../svg/audio.svelte?raw";
import Dante from "../svg/dante.svelte?raw";
import DMX from "../svg/dmx.svelte?raw";
import Ethernet from "../svg/ethernet.svelte?raw";
import USB from "../svg/usb.svelte?raw";
import OSC from "../svg/osc.svelte?raw";
import Power from "../svg/power.svelte?raw";
import SDI from "../svg/sdi.svelte?raw";

const ALL_PROTOCOLS = [
	"dante",
	"dmx",
	"sdi",
	"ethernet",
	"audio",
	"usb",
	"osc",
	"power"]
type Protocol = typeof ALL_PROTOCOLS;
export type ProtocolType = Protocol[number]

// https://stackoverflow.com/questions/21687907/typescript-sorting-an-array
export const protocols: { [type in ProtocolType]: [string, number, string] } = {
	"dante": ["red", 1, Dante],
	"dmx": ["dodgerblue", 2, DMX],
	"sdi": ["limegreen", 3, SDI],
	"ethernet": ["gold", 4, Ethernet],
	"audio": ["orange", 5, Audio],
	"usb": ["hotpink", 6, USB],
	"osc": ["magenta", 7, OSC],
	"power": ["var(--font-colour)", 8, Power]
}

export const iterableProtocols: [ProtocolType, [string, number, string]][] =
	Object.entries(protocols) as [ProtocolType, [string, number, string]][];

export function sortProtocols(t1: ProtocolType, t2: ProtocolType): number {
	let i1 = ALL_PROTOCOLS.indexOf(t1);
	let i2 = ALL_PROTOCOLS.indexOf(t2);
	let direction = Math.sign(i1 - i2);
	return direction;
}
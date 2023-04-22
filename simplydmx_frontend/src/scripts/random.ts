const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";
export function randomId() {
	let str = "";
	for (let i = 0; i < 10; i++) {
		str += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return str;
}

module.exports = (len) => {
	let n = Number(len)?Number(len):0;
	return Math.floor(Math.random() * n);
}
module.exports = {
	name: "randomPokemon",
	aliases: ["rp"],
	run: (client, message, args) => {
		let random = chooseRandom();
		if(client.lastPokemon.get(message.author.id) === random) random = chooseRandom();
		else client.lastPokemon.set(message.author.id, random);
		console.log(random);
		message.reply(`You got **${random}**!`);
	}
};

function shuffle(array) {
	let currentIndex = array.length,
	randomIndex; // While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--; // And swap it with the current element.
		[array[currentIndex],
			array[randomIndex]] = [array[randomIndex],
			array[currentIndex]];
	}
	return array;
}

function chooseRandom() {
	const pokemons = [
		"Azumarill",
		"Duraludon",
		"Hoopa",
		"Aegislash",
		"Trevenant",
		"Dragonite",
		"Decidueye",
		"Greedent",
		"Sylveon",
		"Mamoswine",
		"Blastoise",
		"Blissey",
		"Tsreena",
		"Absol",
		"Greninja",
		"Gardevoir",
		"Zeraora",
		"Pikachu",
		"Snorlax",
		"Crustle",
		"Eldegoss",
		"Talonflame",
		"Lucario",
		"Venusaur",
		"Mr.Mime",
		"Machamp",
		"Slowbro",
		"Wigglytuff",
		"Alolan Ninetales",
		"Cramorant",
		"Gengar",
		"Garchomp",
		"Cinderace"
	];
	const chance = {
		"Absol": 8,
		"Gengar": 5,
		"Machamp": 5,
		"Aegislash": 8,
		"Greninja": 7,
		"Dragonite": 5,
		"Tsreena": 7,
		"Greedent": 9,
	}
	let rolled;
	const roll = () => {
		console.log("rolling!");
		shuffle(pokemons);
		const generated = pokemons[Math.floor(Math.random() * pokemons.length)];
		rolled = generated.toString();
		console.log("rolled! " + rolled);
		if (chance[rolled]) {
			console.log("checking chance");
			if (calculateChance(chance[rolled])) {
				console.log(rolled);
				return rolled;
			} else if (!calculateChance(chance[rolled])) {
				roll();
				return;
			}
		} else {
			console.log("e12");
			return rolled;
		}
	};
	roll();
	return rolled;
}

function calculateChance(chance) {
	const luck = Math.floor(Math.random() * (chance - 1 + 1)) + 1;
	const trueNum = Math.floor(Math.random() * (chance - 1 + 1)) + 1;

	if (luck === trueNum) return true; else return false;
}
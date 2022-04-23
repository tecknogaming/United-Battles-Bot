module.exports = {
	name: "randomTeam",
	aliases: ["rt"],
	run: (client, message, args) => {
		if (args < 2) return message.reply("Please add 2 players!\nexample: \`!rt me1 me2 me3 and-so-on\`");
		message.reply(randomTeams(args));
	}
};

function randomTeams(players) {
	shuffle(players);
	let team1 = [];
	let team2 = [];

	const checkIfEven = () => {
		if (team1.length > team2.length || team1.length < team2.length) {
			team1 = [];
			team2 = [];
			roll();
		}
	}
	const roll = () => {
		for (const player of players) {
			var ranNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

			if (ranNum === 1) {
				if (team1.find(str => str === player.toString())) team2.push(player.toString());
				team1.push(player.toString());
			} else if (ranNum === 2) {
				if (team1.find(str => str === player.toString())) team2.push(player.toString());
				team2.push(player.toString());
			}
		}
		checkIfEven();
	};
	try {
		roll();

		shuffle(team1),
		shuffle(team2);

		const string = `Team 1 consist of:\n${team1 ? team1: team1.join(",\n")}\n\nTeam 2 consist of:\n${team2 ? team2: team2.join(",\n")}`;
		return string;
	} catch(e) {
		return "uneven numbers in an array!"
	}
}

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
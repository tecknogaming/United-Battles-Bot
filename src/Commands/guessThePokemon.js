const { MessageEmbed } = require("discord.js");
const { Spawn } = require("pokecord");

module.exports = {
	name: "guessthepokemon",
	aliases: ["GuessThePokemon", "gtp"],
	group: "Fun",
	run: async (client, message, args) => {
		let time = 1000 * 30;
		let t = "30";
		
		if(args[0] === ("easy" || "EASY" || "Easy"))  { time = 1000 * 60; t = "60" } 
		else if (args[0] === ("hard" || "HARD" || "Hard")) { time = 1000 * 10; t = "10" }
		else if (args[0] === ("pro" || "PRO" || "Pro"))  { time = 1000 * 5; t = "5" }
		
		const msg = await  message.reply("please wait...");
		const pokemon = await Spawn().catch(e => {});
		if (!pokemon) {
			return message.channel.send("Something went wrong!");
		}
		if(pokemon.name.split("-")[0]) pokemon.name = pokemon.name.split("-")[0];
		const filter = m => m.author.id === message.author.id;

		const embed = new MessageEmbed()
		.setColor("#ff0e0e")
		.setTitle(`Who's that pokemon! You Have \`${t}s\` to guess`)
		.setImage(pokemon.imageURL);

		await msg.edit({content: "Who's That Pokemon!",embeds: [embed]});
		
		message.channel.awaitMessages({
			filter,
			max: 1,
			time,
			errors: ['time']
		})
		.then(collected => {
			const m = collected.first();
			if (!m.content || m.content.toLowerCase() !== pokemon.name.toLowerCase()) {
				return message.channel.send(`:x: Incorect answer! the answer was **${pokemon.name}!**`);
			}
			return message.channel.send(`:white_check_mark: The answer was correct! It was **${pokemon.name}**`);
		})
		.catch(() => {
			message.channel.send(`To late the answer was **${pokemon.name}!**`);
		});
	}
};
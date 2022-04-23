const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "help",
	aliases: ["info"],
	usage: "<command(optional)>",
	run: (client, message, args) => {
		let commands = [];
		
		if (args[0]) {
			if(message.author.id !== "743689039026323486") return message.reply("Sorry but this feature is clossed due to errors")
			let cmd = client.commands.get(args[0]);
			if (!cmd) cmd = client.commands.get(client.aliases.get(args[0]));
			if (!cmd) return;
			try {
				if (cmd) {
					const sl = cmd.name.slice(0, 1);
					const name = sl[0].toUpperCase() + cmd.name.slice(1, cmd.name.length);

					return message.channel.send({
						embeds: [
							new MessageEmbed()
							.setColor("#00ccff")
							.setTitle(`${name} Info`)
							.setDescription("\n")
							.addFields(
								{
									name: "Description",
									value: cmd.description.toString() || "no description",
									inline: true
								},
								{
									name: "Aliases",
									value: cmd.aliases ? `\`\`\`${cmd.aliases.join(", ")}\`\`\`` : "```No aliases```",
									inline: true
								},
								{
									name: "Permissions",
									value: cmd.permissions ? `\`\`\`${cmd.permissions.join(", ").split("_").join(" ")}\`\`\`` : "```No Permissions```",
									inline: true
								},
								{
									name: "Usage",
									value: `\`\`\`${client.guildPrefixes.get(message.guild.id)}${cmd.name} ${cmd.usage ? cmd.usage : "No Usage"}\`\`\``,
									inline: true
								}
							)
						]
					});
				} else {
					return message.channel.send("Command not found!");
				}
			} catch(e) {
				Logger.error(e)
				return message.channel.send({
					embeds: [
						new MessageEmbed()
						.setColor("#ff0000")
						.setTitle("AN ERROR HAS ACCURED AND HAS BEEN REPORTED!")
						.setDescription(e.toString())
					]
				});
			}
		}
		
		client.commands.each(command => {
			if(command.hide) return;
			const commandName = typeof command.name === 'string' ? command.name : command.aliases[0];
			commands.push(commandName);
		});
		
		message.reply({
			embeds: [
				new MessageEmbed()
				.setColor("#16d0ff")
				.setTitle("Commands List!")
				.setDescription("You can use \`!help <command>\` to get a better info of that command")
				.addField("All Available Commands:", commands.join(", "))
			]
		})
	}
};
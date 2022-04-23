const config = require("../config.js");
const {
	MessageEmbed,
	Collection
} = require("discord.js");

const Logger = require("@teckno/ilogs");
const logger = new Logger("logs.log");

let recentlyRan = [];

module.exports = async (client, message) => {
	//	console.log(message)
	if (!message.guild || !message.channel || message.author.bot) return;
	if (message.channel.partial) await message.channel.fetch();
	if (message.partial) await message.fetch();
	const prefix = config.prefix;
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
	if (!prefixRegex.test(message.content)) return;
	const [,
		mPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
	const cmd = args.length > 0 ? args.shift().toLowerCase(): null;

	if (message.content === `<@${client.user.id}>`) {
		return message.reply(`My prefix is: \`${prefix}\``);
	}

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (!command) return;
	if (command) {
		let {
			name,
			disabled = false,
			cooldown,
			permissions = [],
			usage = "",
			minArgs = 0,
			maxArgs = null,
			run
		} = command;

		if (!run || disabled) return;
		try {
			if (onCoolDown(message, command)) {
				return message.reply(`You still have to wait \`${onCoolDown(message, command)}s\``);
			}

			if (permissions && permissions.length > 0 && !message.member.permissions.has(permissions)) {
				return message.reply({
					embeds: [
						new MessageEmbed()
						.setAuthor({
							name: client.user.username, iconURL: client.user.avatarURL()
						})
						.setColor("#d21313")
						.setTitle("PERMISSION ERROR")
						.setDescription(`User <@${message.author.id}> is missing the following PERMISSION:\n\n \`` + `${permissions.join(", ")}` + `\``)
					]
				});
			}

			let cooldownString = `${message.guild.id}-${message.member.id}-${name}`;

			/*
		if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
			message.reply("Please wait for the cooldown!");
			return;
		}
*/
			if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
				return message.reply({
					embeds: [
						new MessageEmbed()
						.setAuthor({
							name: client.user.username, iconURL: client.user.avatarURL()
						})
						.setColor("#d21313")
						.setTitle("USAGE ERROR")
						.setDescription("Usage of command is incorect!, The correct usage is:\`" + `${prefix}${name} ${usage ? usage: "Something is wrong!"}` + "\`")
					]
				});
			}
			/*
		if (cooldown > 0) {
			recentlyRan.push(cooldownString);
			setTimeout(() => {
				recentlyRan = recentlyRan.filter((string) => {
					return string !== cooldownString;
				});
			}, 1000 * cooldown || config.command.defCooldown);
		}
*/

			run(client, message, args, prefix, logger);

			logger.log(`${name} was executed!`, false);
		} catch (e) {
			message.reply({
				embeds: [
					new MessageEmbed()
					.setColor("#ff0000")
					.setTitle("ERROR ENCOUNTERED")
					.setDescription(e)
				]})
			return logger.error(e)
		}
	}
};

function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

function onCoolDown(message, command) {

	if (!message || !message.client) throw "No Message with a valid DiscordClient granted as First Parameter";

	if (!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
	const client = message.client;
	if (!client.cooldowns.has(command.name)) {
		//if its not in the cooldown, set it too there
		client.cooldowns.set(command.name, new Collection());
	}
	const now = Date.now(); //get the current time
	const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
	const cooldownAmount = (command.cooldown || config.command.defCooldown) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
	if (timestamps.has(message.member.id)) {
		//if the user is on cooldown
		const expirationTime = timestamps.get(message.member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
		if (now < expirationTime) {
			//if he is still on cooldonw
			const timeLeft = (expirationTime - now) / 1000; //get the lefttime
			//return true
			return timeLeft
		} else {
			//if he is not on cooldown, set it to the cooldown
			timestamps.set(message.member.id, now);
			//set a timeout function with the cooldown, so it gets deleted later on again
			setTimeout(() => timestamps.delete(message.member.id), cooldownAmount);
			//return false aka not on cooldown
			return false;
		}
	} else {
		//if he is not on cooldown, set it to the cooldown
		timestamps.set(message.member.id, now);
		//set a timeout function with the cooldown, so it gets deleted later on again
		setTimeout(() => timestamps.delete(message.member.id), cooldownAmount);
		//return false aka not on cooldown
		return false;
	}
}
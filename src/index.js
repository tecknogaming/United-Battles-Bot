require("dotenv").config();

//imports all required modules
const Discord = require("discord.js");

//loads files
const config = require("./config.js"); //config file

//initialize client
const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_WEBHOOKS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
	]
});

//global client variables
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.modules = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.lastPokemon = new Discord.Collection();

//loads commands and events
require("./Utils/Loader.js")(client, config.commandsFile, config.eventsFile, config.modulesFile);


client.login(process.env.TOKEN); //login to the bot
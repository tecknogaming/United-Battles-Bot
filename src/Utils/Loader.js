const fs = require("fs");
const path = require("path");

module.exports = (client, commandsFile, eventsFile, modulesFile) => {
	function loadCommandsf(dir) //function for loading commands in a folder
	{
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				loadCommandsf(path.join(dir, file));
			} else if (file.endsWith(".js")) {
				const option = require(path.join(__dirname, dir, file));
				if (option.name) {
					if (client) {
						client.commands.set(option.name, option);
					}
					if (option.aliases && Array.isArray(option.aliases)) option.aliases.forEach(alias => client.aliases.set(alias, option.name));
				}
			}
		}
	}

	function loadEventsf(dir) //function for loading all events in a folder
	{
		let amount = 0;
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				loadEventsf(path.join(dir, file)); //if its a directory then do it again
			} else if (file.endsWith(".js")) {
				const event = require(path.join(__dirname, dir, file));
				let eventName = file.split(".")[0];
				client.on(eventName, event.bind(null, client));
				amount++;
			}
		}

		return amount;
	}

	function loadModules(dir) {
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				loadModules(path.join(dir, file));
			} else if (file.endsWith(".js")) {
				const option = require(path.join(__dirname, dir, file));
				if (option.name) {
					if (client) {
						client.modules.set(option.name, option);
					}
				}
			}
		}
	}
	
	loadModules(modulesFile);
	loadCommandsf(commandsFile);
	client.loadedEvents = loadEventsf(eventsFile);
};
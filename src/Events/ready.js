const config = require("../config.js");
const Logger = require("@teckno/ilogs");
const logger = new Logger("logs.log");

module.exports = (client) => {
	console.clear();
	logger.log("Ready? 3.. 2.. 1.. GO!");
	logger.log("Loaded Commands: " + client.commands.size);
	logger.log("Loaded Events: " + client.loadedEvents);
	logger.log("Loaded Modules: " + client.modules.size);

	setStatus(client, config.presance, 5);
};

function setStatus(client, status, interval) {
	let statLength = status.length - 1;
	let currentStatus = 0;

	if (status.length === 1) {
		setInterval(() => {
			client.user.setActivity(status[currentStatus].name, {
				type: status[currentStatus].type
			});
		}, 1000 * 60 * interval);
		return;
	} else {
		client.user.setActivity(status[currentStatus].name, {
				type: status[currentStatus].type
			});
		currentStatus += 1;
		setInterval(function() {
			client.user.setActivity(status[currentStatus].name, {
				type: status[currentStatus].type
			});
			currentStatus += 1;
			if(currentStatus > statLength) currentStatus = 0
		},
			1000 * 60 * interval);
	}
}
const Logger = require("@teckno/ilogs");
const logger = new Logger("logs.log");

module.exports = (client) => {
	logger.custom("Joined A Guild!", {
		name: "GuildCreate",
		color: "blue"
	});
};
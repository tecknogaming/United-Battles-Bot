module.exports = {
	prefix: "!",
	
	commandsFile: "../Commands",
	eventsFile: "../Events",
	modulesFile: "../Modules",
	
	command: {
		defCooldown: 3,
		errorColor: "#ff0000",
		colors: {
			
		},
		messages: {
			error: "ERROR ||| An error has accured and has been reported\n\n<<error>>",
			//syntaxError: "SYNTAX ERROR"
		}
	},
	
	presance: [
		{
			type: "PLAYING",
			name: "Pokemon Unite"
		},
	],
}
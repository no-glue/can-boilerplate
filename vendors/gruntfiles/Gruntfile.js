var clearLog = require("cli-clear");



module.exports = function(grunt)
{
	// Initiated in "welcome", to support coming back from other menus
	var config =
	{
		prompt:
		{
			"action":
			{
				options:
				{
					questions:
					[
						{
							config: "action",
							type: "list",
							message: "What would you like to do?",
							choices: [
								//{ name:"Start a webserver", value:"server" },
								{ name:"Manage dependencies", value:"manage-deps" },
								{ name:"Minify dev assets", value:"minify-assets" },
								{ name:"Compile for production", value:"compile" },
								{ name:"Exit", value:"exit" }
							]
						}
					]
				}
			}
		}
	};
	
	
	
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	// Hide headers
	grunt.log.header_backup = grunt.log.header;
	grunt.log.header = function(){}
	
	
	
	grunt.registerTask("prompt-finished", "", function()
	{
		var action = grunt.config("action");
		
		if (action != "exit")
		{
			require("./"+action+".js")(grunt);
			
			grunt.task.run(action);
		}
		else
		{
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			grunt.util.exit();
		}
	});
	
	
	
	grunt.registerTask("welcome", "", function()
	{
		grunt.initConfig(config);
		
		var done = this.async();
		
		clearLog( function()
		{
			grunt.log.writeln("CAN-BOILERPLATE v0.5.0".underline);
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("default",
	[
		"welcome",
		"prompt",
		"prompt-finished"
	]);
	
	
	
};

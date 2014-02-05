var cliClear = require("cli-clear");



module.exports = function(grunt)
{
	// Skip menus and prompts in express mode
	var express = grunt.cli.tasks.length;
	
	
	
	// Initiated in requested task -- to support returning to "default" from external tasks
	var config =
	{
		title: "{%= title %} v{%= version %}",
		
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
								{ name:"Compile for production", value:"compile" },
								{ name:"Run tests (coming soon)", value:"test" },
								{ name:"Minify media", value:"media" },
								{ name:"Generate documentation (coming soon)", value:"docs" },
								"---",
								{ name:"Start a simple webserver", value:"server" },
								{ name:"Manage dependencies", value:"deps" },
								"---",
								{ name:"Exit", value:"exit" }
							]
						}
					],
					then: function(results)
					{
						if (results["action"] != "exit")
						{
							grunt.task.run( results["action"] );
						}
						else
						{
							// Headers temporarily hidden.. needs space
							grunt.log.writeln("");
							
							grunt.util.exit();
						}
					}
				}
			}
		}
	};
	
	
	
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	// Hide headers
	grunt.log.header_backup = grunt.log.header;
	grunt.log.header = function(){}
	
	
	
	function loadGruntfile()
	{
		// If requested task is not "default", skip the menu
		if (express)
		{
			grunt.initConfig(config);
		}
		
		require("./tools/lib/"+this.name)(grunt, process.cwd(), grunt.config("title").toLowerCase(), express );
		
		grunt.task.run(this.name);
	}
	
	
	
	// Command line task shortcuts
	config.prompt.action.options.questions[0].choices.forEach( function(element, index, array)
	{
		if (typeof element == "object")
		{
			if (element.value != "exit")
			{
				grunt.registerTask(element.value, element.name, loadGruntfile);
			}
		}
	});
	
	
	
	grunt.registerTask("default", "*", function()
	{
		grunt.initConfig(config);
		
		var done = this.async();
		
		cliClear( function()
		{
			grunt.log.writeln( grunt.config("title").underline );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
			
			grunt.task.run("prompt");
		});
	});
	
	
	
};

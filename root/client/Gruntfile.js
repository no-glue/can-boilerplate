module.exports = function(grunt)
{
	grunt.initConfig(
	{
		cfg:
		{
			title: "{%= title %} v{%= version %}",
			title_sub: "(<%= cfg.title.toLowerCase() %>)",
			
			devFolder: "private",
			distFolder: "public",
			
			pkgFile: "package.json",
			pkg: grunt.file.readJSON("package.json"),
			
			sections:
			{
				"start":
				{
					action: ""
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		content: 
		{
			options:
			{
				clearBefore: true,
				gruntLogHeader: false,
				table:
				{
					colWidths: [72]
				}
			},
			"start":
			{
				text: "<%= cfg.title %>".underline
			}
		},
		
		
		
		prompt:
		{
			options:
			{
				gruntLogHeader: false
			},
			"start":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.sections.start.action",
							type: "list",
							message: "What would you like to do?",
							choices: [
								{ name:"Compile for production", value:"compile-w-menu" },
								{ name:"Run tests", value:"test-w-menu" },
								{ name:"Minify media", value:"media-w-menu" },
								{ name:"Generate documentation", value:"docs" },
								"---",
								{ name:"Start a simple webserver", value:"server-w-menu" },
								{ name:"Manage dependencies", value:"deps-w-menu" },
								"---",
								{ name:"Exit", value:"exit" }
							]
						}
					],
					then: function(results)
					{
						var action = results["cfg.sections.start.action"];
						
						if (action != "exit")
						{
							grunt.task.run(action);
						}
					}
				}
			}
		}
	});
	
	
	
	require("grunt-config-merge")(grunt);
	require("grunt-log-headers")(grunt);
	require("jit-grunt")(grunt,
	{
		cancompile: "can-compile",
		generate:   "documentjs",
		includereplace: "grunt-include-replace"
	});
	
	grunt.loadNpmTasks("can-boilerplate-utils");	// "findport" and "shell" tasks
	grunt.loadTasks("tools/lib/tasks");
	
	
	
	// Other tasks ran from menu
	grunt.registerTask("default", "*", ["content:start","prompt:start"]);
	
	
	
};

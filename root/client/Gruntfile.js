module.exports = function(grunt)
{
	grunt.initConfig(
	{
		cfg:
		{
			title: "{%= title %} v{%= version %}",
			title_sub: "(<%= cfg.title.toLowerCase() %>)",
			
			expressMode: grunt.cli.tasks.length,
			helpMode: grunt.cli.options.help,
			
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
								{ name:"Generate documentation (coming soon)", value:"docs" },
								"---",
								{ name:"Start a simple webserver", value:"server-w-menu" },
								{ name:"Manage dependencies", value:"deps" },
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
							loadRemainingTasks();
							
							grunt.task.run(action);
						}
					}
				}
			}
		}
	});
	
	
	
	require("grunt-config-merge")(grunt);
	require("grunt-log-headers")(grunt);
	
	grunt.loadNpmTasks("grunt-content");
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	// Not loaded immediately to speed up display of menu
	function loadRemainingTasks()
	{
		grunt.loadNpmTasks("can-boilerplate-utils");
		grunt.loadNpmTasks("can-compile");
		grunt.loadNpmTasks("grunt-cleanempty");
		grunt.loadNpmTasks("grunt-config");
		grunt.loadNpmTasks("grunt-contrib-clean");
		grunt.loadNpmTasks("grunt-contrib-compress");
		grunt.loadNpmTasks("grunt-contrib-connect");
		grunt.loadNpmTasks("grunt-contrib-copy");
		grunt.loadNpmTasks("grunt-contrib-cssmin");	// TODO: won't be required when contrib-less gets cleancssOptions
		grunt.loadNpmTasks("grunt-contrib-imagemin");
		grunt.loadNpmTasks("grunt-contrib-less");
		grunt.loadNpmTasks("grunt-contrib-requirejs");
		grunt.loadNpmTasks("grunt-contrib-uglify");
		grunt.loadNpmTasks("grunt-include-replace");
		grunt.loadNpmTasks("grunt-mocha");
		grunt.loadNpmTasks("grunt-myth");
		grunt.loadNpmTasks("grunt-svgmin");
		
		grunt.task.loadTasks("tools/lib/tasks");
	}
	
	
	
	// For command line use
	if ( grunt.config("cfg.expressMode") || grunt.config("cfg.helpMode") )
	{
		loadRemainingTasks();
		
		// continues onto task specified at command line..
	}
	
	
	
	// Other tasks ran from menu
	grunt.registerTask("default", ["content:start","prompt:start"]);
	
	
	
};

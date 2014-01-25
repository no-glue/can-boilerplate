var bower = require("bower");
var clearLog = require("cli-clear");



module.exports = function(grunt)
{
	// Initiated in "welcome_manage-deps", to support going back to other menus
	var config =
	{
		bwr: grunt.file.readJSON("../repo/bower.json"),
		
		prompt:
		{
			"deps":
			{
				options:
				{
					questions:
					[
						{
							config: "action",
							type: "list",
							message: "Manage dependencies:",
							choices: [
								{ name:"Install all", value:"install" },
								{ name:"Update all", value:"update" },
								{ name:"⟵ Go back", value:"return" }
							]
						}
					]
				}
			}
		}
	};
	
	
	
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	grunt.registerTask("prompt-finished_manage-deps", "", function()
	{
		var action = grunt.config("action");
		
		if (action == "return")
		{
			grunt.task.run("default");
		}
		else
		{
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			var deps = new Array();
			var depsConfig = grunt.config("bwr.dependencies");
			var done = this.async();
			
			for (var i in depsConfig)
			{
				deps.push( (action=="install") ? i+"#"+depsConfig[i] : i );
			}
			
			bower.commands[action](deps).on("log", function(result)
			{
				if (result.id=="cached" || result.id=="download" || result.id=="install")
				{
					grunt.log.writeln(result.id.green+" "+result.message);
				}
			})
			.on("error", function(error){ grunt.fail.fatal(error) })
			.on("end", function(){ done() });
			
			// Show headers
			grunt.log.header = grunt.log.header_backup;
		}
	});
	
	
	
	grunt.registerTask("welcome_manage-deps", "", function()
	{
		grunt.initConfig(config);
		
		var done = this.async();
		
		clearLog( function()
		{
			done();
		});
	});
	
	
	
	grunt.registerTask("manage-deps",
	[
		"welcome_manage-deps",
		"prompt",
		"prompt-finished_manage-deps"
	]);
	
	
	
};

var cliTable = require("cli-table");
var fs = require("fs");
var rimraf = require("rimraf");

var runCommand = require("./util/runCommand");



module.exports = function(grunt, cwd, title)
{
	// Initiated in welcome task -- to support returning from "default" multiple times
	var config =
	{
		bwr: grunt.file.readJSON(cwd+"/bower.json"),
		
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
							message: "What would you like to do?",
							choices: [
								{ name:"Update all", value:"update" },
								{ name:"Reinstall all", value:"install" },
								"---",
								{ name:"⟵ Go back", value:"return" }
							]
						}
					],
					then: function(results)
					{
						var action = results["action"];
						
						if (action == "return")
						{
							grunt.task.run("default");
						}
						else
						{
							// Show headers
							grunt.log.header = grunt.log.header_backup;
							
							var task = ["npm","bower"];
							
							if (action == "install")
							{
								task.unshift("clear");
							}
							
							grunt.task.run(task);
						}
					}
				}
			}
		}
	};
	
	
	
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	function deps()
	{
		var done = this.async();
		
		runCommand(this.name, grunt.config("action"), cwd, function()
		{
			done();
		});
	}
	
	
	
	grunt.registerTask("bower", "", deps);
	grunt.registerTask("npm",   "", deps);
	
	
	
	grunt.registerTask("clear", "Remove dependencies for a reinstall", function()
	{
		var path = require("path");
		
		["private/vendors/", "node_modules/"].forEach( function(element, index, array)
		{
			if ( fs.existsSync(element) )
			{
				rimraf.sync(element, function(error)
				{
					grunt.fail.fatal(error);
				});
				
				grunt.log.writeln("Removed ".cyan+path.resolve(element));
			}
		});
	});
	
	
	
	// Avoids overriding "welcome" in main gruntfile
	grunt.registerTask("welcome_deps", "", function()
	{
		grunt.initConfig(config);
		
		var done = this.async();
		
		require("cli-clear")( function()
		{
			var description = "DEPENDENCY MANAGEMENT".underline+" ("+title+")";
			description += "\n\nUpdate & install existing and missing components for Node.js and"
			description += "\nBower.";
			description += "\n\nA reinstall is available for when making large changes to";
			description += "\ndependencies, or in the remote event that they'd become damaged.";
			
			var table = new cliTable({ colWidths:[72] });
			
			table.push( [description] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	// Called from main gruntfile
	grunt.registerTask("deps", ["welcome_deps","prompt"]);
	
	
	
};

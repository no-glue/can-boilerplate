var fs = require("fs");
var runCommand = require("./util/runCommand");

var client = require("path").resolve(__dirname+"/../../");



exports.init = function(endGruntTask)
{
	// If parent Grunt task, reinstall everything
	var hasBowerComponents = (endGruntTask) ? false : fs.existsSync(client+"/private/vendors/");
	var hasNodeModules     = (endGruntTask) ? false : fs.existsSync(client+"/node_modules/");
	
	if (hasNodeModules)
	{
		if (hasBowerComponents)
		{
			exports.finished(endGruntTask);
		}
		else
		{
			runCommand("bower", "install", client, function()
			{
				exports.finished(endGruntTask);
			});
		}
	}
	else
	{
		runCommand("npm", "install", client, function()
		{
			if (!hasBowerComponents)
			{
				runCommand("bower", "install", client, function()
				{
					exports.finished(endGruntTask);
				});
			}
			else
			{
				exports.finished(endGruntTask);
			}
		});
	}
	
	return exports;
}



exports.finished = function(endGruntTask)
{
	// Complete any parent Grunt task
	if (endGruntTask)
	{
		endGruntTask();
	}
	// Tools should not run after generating a project
	else
	{
		// Hack
		require("grunt").cli(
		{
			base: client,
			gruntfile: client+"/Gruntfile.js"
		});
	}
}



// Not called from parent Grunt task
if (process.argv[2] != undefined)
{
	// Remove "tools" as it is not a Grunt task
	if (process.argv[2] == "tools")
	{
		process.argv.splice(2);
	}
	
	// Any other parameter will be passed as a Grunt task
	
	exports.init();
}

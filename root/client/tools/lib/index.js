var fs = require("fs");

var client = require("path").resolve(__dirname+"/../../");



function init(endGruntTask)
{
	clearTimeout(noParentGruntTask);
	
	// If parent Grunt task, install everything
	var hasBowerComponents = (endGruntTask) ? false : fs.existsSync(client+"/private/vendors/");
	var hasNodeModules     = (endGruntTask) ? false : fs.existsSync(client+"/node_modules/");
	
	if (hasNodeModules)
	{
		if (hasBowerComponents)
		{
			finished(endGruntTask);
		}
		else
		{
			bowerInstall( function()
			{
				finished(endGruntTask);
			});
		}
	}
	else
	{
		npmInstall( function()
		{
			if (!hasBowerComponents)
			{
				bowerInstall( function()
				{
					finished(endGruntTask);
				});
			}
			else
			{
				finished(endGruntTask);
			}
		});
	}
	
	return exports;
}



function bowerInstall(callback)
{
	// Use Bower API instead of CLI so that it doesn't need to be installed globally
	var bower = require("can-boilerplate-utils").bower();
	
	bower.install(callback, {cwd:client});
}



function finished(endGruntTask)
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
			//stack: true,	// debug
			base: client,
			gruntfile: client+"/Gruntfile.js"
		});
	}
}



function npmInstall(callback)
{
	// NPM comes installed globally with Node, so it's "safe" to use CLI
	require("child_process").spawn("npm", ["install"], {cwd:client, stdio:"inherit"}).on("exit", function(code)
	{
		this.removeAllListeners();
		
		callback();
	});
}



// Gets cancelled in init() when called from parent Grunt task
var noParentGruntTask = setTimeout( function()
{
	init();
});



module.exports =
{
	init: init
};

var fs = require("fs");

var client = require("path").resolve(__dirname+"/../../");



function init(endGruntTask)
{
	clearImmediate(noParentGruntTask);
	
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
		// Installs NPM and Bower packages
		npmInstall( function()
		{
			finished(endGruntTask);
		});
	}
	
	return exports;
}



function bowerInstall(callback)
{
	require("child_process").spawn("npm", ["run-script","install"], {cwd:client, stdio:"inherit"}).on("exit", function(code)
	{
		this.removeAllListeners();
		
		callback();
	});
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
	// Also runs "bower install" from package.json
	require("child_process").spawn("npm", ["install"], {cwd:client, stdio:"inherit"}).on("exit", function(code)
	{
		this.removeAllListeners();
		
		callback();
	});
}



// Gets cancelled in init() when called from parent Grunt task
var noParentGruntTask = setImmediate( function()
{
	init();
});



module.exports =
{
	init: init
};

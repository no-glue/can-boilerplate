module.exports = function(grunt)
{
	var answersInfo = require("./answersInfo")(grunt);
	var bowerDependencies = require("./bowerDependencies")(grunt);
	var fs = require("fs");
	
	
	
	function complete(results)
	{
		bowerDependencies.populate( "cfg.project.bwr.dependencies", answersInfo.getDepsList("cfg.project.deps") );
		
		//console.log( require("util").inspect(grunt.config("cfg"),false,null) );
	}
	
	
	
	function cwdIsEmpty(answers)
	{
		var cwdContents = require("fs").readdirSync( grunt.config("cfg.generator.cwd") );
		
		if (cwdContents.length)
		{
			if (cwdContents.length == 1)
			{
				// Ignores .DS_Store
				// TODO :: check for hidden Windows files
				if (cwdContents[0] == ".DS_Store")
				//if (cwdContents[0].substr(0,1) == ".")
				{
					return false;
				}
			}
			
			return true;
		}
		
		return false;
	}
	
	
	
	function notBypassNonEmptyDir(answers)
	{
		// TODO :: this is a workaround for filter/validate not working with type:confirm
		if ( answers["cfg.generator.bypassNonEmptyDir"] === false )
		{
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			process.exit();
		}
		
		return true;
	}
	
	
	
	function notDefaultSettings(answers)
	{
		return answers["cfg.generator.defaultSettings"] === false;
	}
	
	
	
	return {
		complete: complete,
		cwdIsEmpty: cwdIsEmpty,
		notBypassNonEmptyDir: notBypassNonEmptyDir,
		notDefaultSettings: notDefaultSettings
	};
}

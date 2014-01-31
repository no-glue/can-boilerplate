var fs = require("fs");
var path = require("path");
var url = require("url");



function BowerDependencies(grunt)
{
	this.grunt = grunt;
}



BowerDependencies.prototype.getInstalledPath = function(dep, cwd)
{
	var parents = cwd+"/client/private/";
	var dir = parents+"vendors/"+dep;
	var filepath = "vendors/COULD-NOT-FIND-FOLDER";	// default -- let them figure it out
	
	if ( fs.existsSync(dir) )
	{
		filepath = dir+"/INCOMPLETE-OR-MISSING-BOWER.JSON";	// secondary default
		
		var json;
		
		if ( fs.existsSync(dir+"/bower.json") )
		{
			json = dir+"/bower.json";
		}
		else if ( fs.existsSync(dir+"/.bower.json") )
		{
			json = dir+"/.bower.json";
		}
		
		if (json)
		{
			json = this.grunt.file.readJSON(json);
			
			if (json.main)
			{
				filepath = path.resolve(dir+"/"+json.main);
			}
		}
		
		// Shorten URL
		filepath = filepath.substr(parents.length);
	}
	
	return filepath;
}



BowerDependencies.prototype.parseConfig = function(cfg, callback)
{
	cfg = this.grunt.config(cfg);
	
	for (var i in cfg)
	{
		var language = cfg[i];
		
		for (var j in language)
		{
			callback( language[j], i );
		}
	}
}



BowerDependencies.prototype.parseGitURL = function(giturl)
{
	giturl = url.parse(giturl);
	
	var obj = {};
	
	if (!giturl.protocol)
	{
		obj.name    = giturl.path;
		obj.version = giturl.hash ? giturl.hash.substr(1) : "latest";
	}
	else
	{
		obj.name    = giturl.path.substring(giturl.path.lastIndexOf("/")+1, giturl.path.lastIndexOf("."))
		obj.version = giturl.href;
	}
	
	return obj;
}



BowerDependencies.prototype.populate = function(bwr, cfg)
{
	var bwr_string = bwr;
	
	bwr = this.grunt.config(bwr);
	
	var arr = [];
	var obj = {};
	
	this.parseConfig(cfg, function(dep, type)
	{
		if ( Array.isArray(dep) )
		{
			arr = arr.concat(dep);
		}
		else
		{
			arr.push(dep);
		}
	});
	
	for (var i in bwr)
	{
		arr.push(i);
	}
	
	// Sort for easy editing later
	arr.sort();
	
	// Reset
	this.grunt.config(bwr_string, {});
	
	arr.forEach( function(element, index, array)
	{
		// Had to use "-" because "" caused `.value` to be subsituted with `.name` in grunt-prompt
		if (element != "-")
		{
			element = this.parseGitURL(element);
			
			obj[element.name] = element.version;
		}
	}, this);
	
	this.grunt.config(bwr_string, obj);
}



module.exports = BowerDependencies;

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
	var error = 1;	// default
	
	if ( fs.existsSync(dir) )
	{
		error = 2;
		
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
				error = 0;
			}
		}
	}
	
	switch (error)
	{
		case 1:
		{
			filepath = "vendors/COULD-NOT-FIND-FOLDER";
			break;
		}
		case 2:
		{
			filepath = dir+"/INCOMPLETE-OR-MISSING-BOWER.JSON";
			break;
		}
	}
	
	// Exclude `parents` for a relative dev environment
	if (filepath.indexOf(parents) == 0)
	{
		filepath = filepath.substr(parents.length);
	}
	
	return {path:filepath, error:error>0};
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



BowerDependencies.prototype.populate = function(bwr, array)
{
	var sorted = {};
	var temp_arr = []
	var temp_obj = {};
	
	// Extract names and versions
	array.forEach( function(element)
	{
		element = this.parseGitURL(element);
		
		temp_obj[element.name] = element.version;
		
		temp_arr.push(element.name);
		
	}, this);
	
	// Sort for easy editing later
	temp_arr.sort().forEach( function(element, i)
	{
		sorted[ temp_arr[i] ] = temp_obj[ temp_arr[i] ];
	});
	
	this.grunt.config(bwr, sorted);
}



module.exports = BowerDependencies;

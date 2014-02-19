module.exports = function(grunt)
{
	var util = require("../util")(grunt);
	
	
	
	grunt.registerTask("template-preparation", "Prepare template data.", function()
	{
		var deps = grunt.config("cfg.project.deps");
		
		deps = util.answersInfo.eachEveryAnswer(deps, function(answer)
		{
			// Avoid showing log errors for intentionally empty dependencies
			if (answer.name != "")
			{
				var name = util.bowerDependencies.parseGitURL(answer.name).name;	// in case it's a URL
				var path = util.bowerDependencies.getInstalledPath(name, grunt.config("cfg.generator.cwd"));
				
				if (path.error)
				{
					grunt.log.error('Could not resolve path for "'+name+'"');
				}
				
				answer.name = name;
				answer.path = path.path;
			}
			
			return answer;
		});
		
		grunt.config("cfg.project.deps", deps);
	});
}

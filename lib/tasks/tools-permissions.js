module.exports = function(grunt)
{
	grunt.registerTask("tools-permissions", "Set ownership of certain files.", function()
	{
		function logChanges(count)
		{
			var s = (!count || count>1) ? "s" : "";
			
			grunt.log.writeln("Modified "+count.toString().cyan+" file"+s);
		}
		
		// *.command files need ownership  --  https://discussions.apple.com/message/16030281#16030281
		// TODO find out about *.sh files
		if ( process.platform.indexOf("win") >= 0 )
		{
			var done = this.async();
			
			require("child_process").exec('chmod u+x "'+grunt.template.process("<%= cfg.generator.cwd %>")+'"/client/tools/*.command', function(error, stdout, stderr)
			{
				logChanges(1);
				
				done();
			});
		}
		else
		{
			logChanges(0);
		}
	});
}

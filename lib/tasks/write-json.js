module.exports = function(grunt)
{
	function writeFile(file, cfg)
	{
		grunt.file.write
		(
			grunt.template.process(file),
			JSON.stringify( grunt.config(cfg), null, "  " )
		);
	}
	
	
	
	grunt.registerTask("write-json", "Save changes to JSON files.", function()
	{
		writeFile("<%= cfg.project.bwr_output %>", "cfg.project.bwr");
		writeFile("<%= cfg.project.pkg_output %>", "cfg.project.pkg");
		
		grunt.log.writeln("Modified "+"2".cyan+" files");
	});
}

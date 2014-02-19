module.exports = function(grunt)
{
	grunt.registerTask("install", "Install Node and Bower dependencies.", function()
	{
		require( grunt.template.process("<%= cfg.generator.cwd %>/client/tools/lib") ).init( this.async() );
	});
}

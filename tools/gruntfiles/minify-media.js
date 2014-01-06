module.exports = function(grunt)
{
	grunt.initConfig(
	{
		copy:
		{
			backup:
			{
				files:
				[
					{ cwd:"../src/assets/media/", src:["**"], dest:"../src/assets/media-uncompressed_<%= grunt.template.today('yyyy-mm-dd@hh-MM-ss') %>/", expand:true }
				]
			}
		},
		
		
		
		imagemin:
		{
			"all png/jpg/gif":
			{
				files:
				[
					{ cwd:"../src/assets/media/", src:["**/*.{png,jpg,gif}"], dest:"../src/assets/media/", expand:true }
				]
			}
		},
		
		
		
		prompt:
		{
			"config":
			{
				options:
				{
					questions:
					[
						{
							config: "makeBackup",
							type: "confirm",
							message: "Backup before process",
							default: false
						}
					]
				}
			}
		},
		
		
		
		svgmin:
		{
			"all svg":
			{
				files:
				[
					{ cwd:"../src/assets/media/", src:["**/*.svg"], dest:"../src/assets/media/", expand:true }
				]
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-prompt");
	grunt.loadNpmTasks("grunt-svgmin");
	
	
	
	grunt.log.writeln("\nDEV MEDIA");
	grunt.log.writeln("This will minify all png,jpg,gif,svg files in ../src/assets/media/");
	
	
	
	grunt.registerTask("prompt-finished", "", function()
	{
		if ( !grunt.config("makeBackup") )
		{
			grunt.config("copy.backup", {});
			
			grunt.log.ok("Emptied copy:backup task");
		}
	});
	
	grunt.registerTask("default",
	[
		"prompt",
		"prompt-finished",
		
		"copy",
		"imagemin",
		"svgmin"
	]);
	
	
	
};

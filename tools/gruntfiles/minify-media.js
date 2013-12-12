module.exports = function(grunt)
{
	// Makes a backup folder of /assets/media/
	var makeBackup = true;
	
	
	
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
	
	
	
	// won't work until grunt v0.5
	/*grunt.loadNpmTasks(
	[
		"grunt-contrib-copy",
		"grunt-contrib-imagemin",
		"grunt-svgmin"
	]);*/
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-svgmin");
	
	
	
	var task = ["imagemin","svgmin"];
	if (makeBackup) task.unshift("copy");
	
	grunt.registerTask("default", task);
	
	
	
};

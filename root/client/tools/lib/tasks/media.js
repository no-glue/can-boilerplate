module.exports = function(grunt)
{
	grunt.mergeConfig(
	{
		cfg:
		{
			sections:
			{
				"media":
				{
					makeBackup: false,
					
					folder:       "<%= cfg.devFolder %>/media/",
					backupFolder: "<%= cfg.devFolder %>/media-uncompressed_<%= grunt.template.today('yyyy-mm-dd@hh-MM-ss') %>/"
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		content: 
		{
			"media":
			{
				table:
				[
					[
						[
							 "MEDIA MINIFIER".underline+" <%= cfg.title_sub %>"
							+"\n\nThis will minify all png,jpg,gif,svg files"
							+"\nwithin: "+"<%= cfg.sections.media.folder %>".yellow
							+"\n\nRunning this on your source files rather than production greatly"
							+"\nimproves compile time."
						]
					]
				]
			}
		},
		
		
		
		copy:
		{
			"media":
			{
				files:
				[
					{ cwd:"<%= cfg.sections.media.folder %>", src:["**"], dest:"<%= cfg.sections.media.backupFolder %>", expand:true }
				]
			}
		},
		
		
		
		imagemin:
		{
			"media":
			{
				files:
				[
					{ cwd:"<%= cfg.sections.media.folder %>", src:["**/*.{png,jpg,gif}"], dest:"<%= cfg.sections.media.folder %>", expand:true }
				]
			}
		},
		
		
		
		prompt:
		{
			"media":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.sections.media.makeBackup",
							type: "confirm",
							message: "Backup before processing?",
							default: "<%= cfg.sections.media.makeBackup %>"
						}
					],
					then: function(results)
					{
						grunt.task.run( results["cfg.sections.media.makeBackup"] ? "media-backup" : "media" );
					}
				}
			}
		},
		
		
		
		svgmin:
		{
			"media":
			{
				files:
				[
					{ cwd:"<%= cfg.sections.media.folder %>", src:["**/*.svg"], dest:"<%= cfg.sections.media.folder %>", expand:true }
				]
			}
		}
	});
	
	
	
	grunt.registerTask("media", ["imagemin:media","svgmin:media"]);
	grunt.registerTask("media-backup", ["copy:media","media"]);
	
	grunt.registerTask("media-w-menu", ["content:media","prompt:media"]);
	
	
	
};

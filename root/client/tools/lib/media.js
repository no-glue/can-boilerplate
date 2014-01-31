var cliClear = require("cli-clear");
var cliTable = require("cli-table");



module.exports = function(grunt, cwd, title)
{
	var backup = "private/media-uncompressed_<%= grunt.template.today('yyyy-mm-dd@hh-MM-ss') %>/";
	var media  = "private/media/";
	
	
	
	grunt.initConfig(
	{
		copy:
		{
			"backup":
			{
				files:
				[
					{ cwd:media, src:["**"], dest:backup, expand:true }
				]
			}
		},
		
		
		
		imagemin:
		{
			"all png/jpg/gif":
			{
				files:
				[
					{ cwd:media, src:["**/*.{png,jpg,gif}"], dest:media, expand:true }
				]
			}
		},
		
		
		
		prompt:
		{
			"backup":
			{
				options:
				{
					questions:
					[
						{
							config: "makeBackup",
							type: "confirm",
							message: "Backup before processing?",
							default: false
						}
					],
					then: function(results)
					{
						if ( !results["makeBackup"] )
						{
							grunt.config("copy.backup", {});
						}
						
						// Show headers
						grunt.log.header = grunt.log.header_backup;
					}
				}
			}
		},
		
		
		
		svgmin:
		{
			"all svg":
			{
				files:
				[
					{ cwd:media, src:["**/*.svg"], dest:media, expand:true }
				]
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-prompt");
	grunt.loadNpmTasks("grunt-svgmin");
	
	
	
	grunt.registerTask("welcome", "", function()
	{
		var done = this.async();
		
		cliClear( function()
		{
			var description = "MINIFY MEDIA".underline+" ("+title+")";
			description += "\n\nThis will minify all png,jpg,gif,svg files";
			description += "\nwithin: "+media.yellow;
			description += "\n\nRunning this on your source files rather than production greatly";
			description += "\nimproves compile time.";
			
			var table = new cliTable({ colWidths:[72] });
			
			table.push( [description] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("media",
	[
		"welcome",
		"prompt",
		
		"copy",
		"imagemin",
		"svgmin"
	]);
	
	
	
};

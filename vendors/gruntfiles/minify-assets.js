var clearLog = require("cli-clear");
var Table = require("cli-table");



module.exports = function(grunt)
{
	var backup = "../repo/client-dev/assets-uncompressed_<%= grunt.template.today('yyyy-mm-dd@hh-MM-ss') %>/";
	var media  = "../repo/client-dev/assets/";
	
	
	
	grunt.initConfig(
	{
		copy:
		{
			backup:
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
					{ cwd:media, src:["**/*.svg"], dest:media, expand:true }
				]
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-prompt");
	grunt.loadNpmTasks("grunt-svgmin");
	
	
	
	grunt.registerTask("prompt-finished", "", function()
	{
		if ( !grunt.config("makeBackup") )
		{
			grunt.config("copy.backup", {});
		}
		
		// Show headers
		grunt.log.header = grunt.log.header_backup;
	});
	
	
	
	grunt.registerTask("welcome", "", function()
	{
		var done = this.async();
		
		clearLog( function()
		{
			var description = "MINIFY DEV ASSETS".underline;
			description += "\nThis will minify all png,jpg,gif,svg files";
			description += "\nwithin: "+media.yellow;
			
			var table = new Table({ colWidths:[72] });
			
			table.push( [description] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("minify-assets",
	[
		"welcome",
		"prompt",
		"prompt-finished",
		
		"copy",
		"imagemin",
		"svgmin"
	]);
	
	
	
};

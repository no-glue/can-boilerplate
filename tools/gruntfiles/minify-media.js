var clearLog = require("cli-clear");
var Table = require("cli-table");



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
					{ cwd:"../src/assets/media/", src:["**/*.svg"], dest:"../src/assets/media/", expand:true }
				]
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-prompt");
	grunt.loadNpmTasks("grunt-svgmin");
	
	
	
	// Hide headers
	grunt.log.header_backup = grunt.log.header;
	grunt.log.header = function(){}
	
	
	
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
			var description = "MINIFY DEV MEDIA".underline;
			description += "\nThis will minify all png,jpg,gif,svg files";
			description += "\nwithin: "+"../src/assets/media/".yellow;
			
			var table = new Table({ colWidths:[72] });
			
			table.push( [description] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("default",
	[
		"welcome",
		"prompt",
		"prompt-finished",
		
		"copy",
		"imagemin",
		"svgmin"
	]);
	
	
	
};

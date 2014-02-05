var cliClear = require("cli-clear");
var cliTable = require("cli-table");
var fs = require("fs");



module.exports = function(grunt, cwd, title)
{
	grunt.initConfig(
	{
		connect:
		{
			"server":
			{
				options:
				{
					base: "private/",	// gets changed
					keepalive: true,
					port: 8080,
					middleware: function(connect, options)
					{
						var middlewares = [];
						
						if ( !Array.isArray(options.base) )
						{
							options.base = [options.base];
						}
						
						var directory = options.directory || options.base[options.base.length - 1];
						
						// Serve static files
						options.base.forEach( function(base)
						{
							middlewares.push( connect.static(base) );
						});
						
						// Make directory browse-able
						middlewares.push( connect.directory(directory) );
						
						// Not found -- just serve index.html
						middlewares.push( function(req, res)
						{
							for (var file, i=0; i<options.base.length; i++)
							{
								file = options.base + "/index.html"; 
								
								if ( grunt.file.exists(file) )
								{
									fs.createReadStream(file).pipe(res);
									return;
								}
							}
							
							res.statusCode(404); // where's index.html?
							res.end();
						});
						
						return middlewares;
					},
				}
			}
		},
		
		
		
		prompt:
		{
			"base":
			{
				options:
				{
					questions:
					[
						{
							config: "connect.server.options.base",
							type: "list",
							message: "Which folder?",
							choices: [
								{ name:"private/" },
								{ name:"public/" }
							]
						},
						{
							config: "connect.server.options.port",
							type: "input",
							message: "What port?",
							default: "<%= connect.server.options.port %>",
						}
					],
					then: function(results)
					{
						// Show headers
						grunt.log.header = grunt.log.header_backup;
					}
				}
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	grunt.registerTask("welcome", "", function()
	{
		var done = this.async();
		
		cliClear( function()
		{
			var description = "SIMPLE WEBSERVER".underline+" ("+title+")";
			description += "\n\nThis will route 404s to /index.html for your app to handle.";
			
			var table = new cliTable({ colWidths:[72] });
			
			table.push( [description] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("server",
	[
		"welcome",
		"prompt",
		
		"connect"
	]);
	
	
	
};

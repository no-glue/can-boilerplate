module.exports = function(grunt)
{
	var util = require("can-boilerplate-utils").server;
	
	
	
	grunt.mergeConfig(
	{
		cfg:
		{
			sections:
			{
				"server":
				{
					base: "<%= cfg.devFolder %>",	// gets changed by prompt:server
					port: ""	// gets changed by findport and prompt:server
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		connect:
		{
			options:
			{
				middleware: util.connect.middleware
			},
			"server":
			{
				options:
				{
					base: "<%= cfg.sections.server.base %>",
					keepalive: true,
					port: "<%= cfg.sections.server.port %>"
				}
			}
		},
		
		
		
		content: 
		{
			"server":
			{
				table:
				[
					[
						[
							 "SIMPLE WEBSERVER".underline+" <%= cfg.title_sub %>"
							+"\n\nThis will route 404s to /index.html for your app to handle."
						]
					],
					function()
					{
						var primaryPort = grunt.config("findport.options.primaryPort");
						
						if ( parseInt( grunt.config("cfg.sections.server.port") ) != primaryPort )
						{
							return [ ["Note:".yellow+" Default port ("+primaryPort+") is already in use."] ];
						}
					}
				]
			}
		},
		
		
		
		findport:
		{
			options:
			{
				gruntLogHeader: false,
				
				config: "cfg.sections.server.port",	// config to change when port is found
				primaryPort: 80,
				secondaryPortStart: 8000,	// if primaryPort is busy, start looking here
				secondaryPortChecks: 30		// gotta stop looking eventually
			}
		},
		
		
		
		prompt:
		{
			"server":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.sections.server.base",
							type: "list",
							message: "Which folder?",
							choices: [
								{ name:"<%= cfg.devFolder %>/" },
								{ name:"<%= cfg.distFolder %>/" }
							]
						},
						{
							config: "cfg.sections.server.port",
							type: "input",
							message: "What port?",
							default: "<%= cfg.sections.server.port %>"
						}
					]
				}
			}
		}
	});
	
	
	
	grunt.registerTask("server", "Start a simple webserver.", ["findport","connect:server"]);
	
	grunt.registerTask("server-w-menu", "*", ["findport","content:server","prompt:server","connect:server"]);
	
	
	
};

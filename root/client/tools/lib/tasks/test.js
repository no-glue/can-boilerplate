module.exports = function(grunt)
{
	grunt.mergeConfig(
	{
		cfg:
		{
			sections:
			{
				"test":
				{
					action: ""
				}
			}
		},
		
		
		// Tasks
		
		
		
		connect:
		{
			"test-dev":
			{
				options:
				{
					base: "<%= cfg.devFolder %>",
					port: 8081
				}
			},
			"test-dist":
			{
				options:
				{
					base: "<%= cfg.distFolder %>",
					port: 8082
				}
			}
		},
		
		
		
		content: 
		{
			"test":
			{
				table:
				[
					[
						[
							 "TEST RUNNER".underline+" <%= cfg.title_sub %>"
							+"\n\nRun automated Mocha and FuncUnit tests."
							+"\n\n"+"Note:".yellow+" Testing <%= cfg.distFolder %>/ will auto-compile your project."
						]
					]
				]
			}
		},
		
		
		
		copy:
		{
			"test-dest":
			{
				files:
				[
					{ cwd:"<%= cfg.devFolder %>/test/",    src:["**"], dest:"<%= cfg.distFolder %>/test/",    expand:true },
					{ cwd:"<%= cfg.devFolder %>/vendors/", src:["**"], dest:"<%= cfg.distFolder %>/vendors/", expand:true }
				]
			}
		},
		
		
		
		mocha:
		{
			options:
			{
				bail: true,
				logErrors: true,
				reporter: "Spec",
				run: true
			},
			"test-dev":
			{
				options:
				{
					urls: ["http://localhost:<%= connect['test-dev'].options.port %>/test/test.html"]
				}
			},
			"test-dist":
			{
				options:
				{
					urls: ["http://localhost:<%= connect['test-dist'].options.port %>/test/test.html"]
				}
			}
		},
		
		
		
		prompt:
		{
			"test":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.sections.test.action",
							type: "list",
							message: "What would you like to test?",
							choices: [
								{ name:"<%= cfg.devFolder %>/",  value:"test-dev" },
								{ name:"<%= cfg.distFolder %>/", value:"test-dist" },
								{ name:"Both", value:"test" },
								"---",
								{ name:"⟵ Go back", value:"default" }
							]
						}
					],
					then: function(results)
					{
						grunt.task.run( results["cfg.sections.test.action"] );
					}
				}
			}
		}
	});
	
	
	
	grunt.registerTask("test", ["test-dev","test-dist"]);
	
	grunt.registerTask("test-dev",  ["connect:test-dev","mocha:test-dev"]);
	grunt.registerTask("test-dist", ["connect:test-dist","compile","copy:test-dest","mocha:test-dist","clean:compile-pre"]);
	
	grunt.registerTask("test-w-menu", ["content:test", "prompt:test"]);
	
	
	
};

module.exports = function(grunt)
{
	grunt.mergeConfig(
	{
		cfg:
		{
			sections:
			{
				"docs":
				{
					docsFolder: "docs"
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		clean:
		{
			"docs":
			{
				src:  ["<%= cfg.sections.docs.docsFolder %>"]
			}
		},
		
		
		
		/*content: 
		{
			"docs":
			{
				table:
				[
					[
						[
							 "DOCUMENTATION GENERATOR".underline+" <%= cfg.title_sub %>"
							+"\n\nUpdate & install existing and missing components for Node.js and"
							+"\nBower."
							+"\n\nA reinstall is available for making large changes to dependencies,"
							+"\nor in the remote event that they'd become damaged."
						]
					]
				]
			}
		},*/
		
		
		
		// DocumentJS
		generate:
		{
			"docs":
			{
				files:
				[
					{
						cwd: "<%= cfg.devFolder %>",
						src: ["**/*.js", "!test/**/*.js", "!vendors/**/*.js"],
						dest: "<%= cfg.sections.docs.docsFolder %>",
						expand: true
					}
				]
			}
		},
		
		
		
		/*prompt:
		{
			"docs":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.sections.deps.action",
							type: "list",
							message: "What would you like to do?",
							choices: [
								{ name:"Update all", value:"deps-update" },
								{ name:"Reinstall all", value:"deps-install" },
								"---",
								{ name:"⟵ Go back", value:"default" }
							]
						}
					],
					then: function(results)
					{
						grunt.task.run( results["cfg.sections.deps.action"] );
					}
				}
			}
		}*/
	});
	
	
	
	grunt.registerTask("docs", "Generate documentation.", ["clean:docs","generate:docs"]);
	
	
	
};

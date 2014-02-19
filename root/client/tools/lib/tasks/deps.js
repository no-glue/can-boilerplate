module.exports = function(grunt)
{
	grunt.mergeConfig(
	{
		cfg:
		{
			sections:
			{
				"deps":
				{
					action: ""
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		bower:
		{
			"install": { command:"install" },
			"update":  { command:"update" }
		},
		
		
		
		clean:
		{
			"deps":
			{
				src:  ["<%= cfg.devFolder %>/vendors/", "node_modules/"]
			}
		},
		
		
		
		content: 
		{
			"deps":
			{
				table:
				[
					[
						[
							 "DEPENDENCY MANAGEMENT".underline+" <%= cfg.title_sub %>"
							+"\n\nUpdate & install existing and missing components for Node.js and"
							+"\nBower."
							+"\n\nA reinstall is available for making large changes to dependencies,"
							+"\nor in the remote event that they'd become damaged."
						]
					]
				]
			}
		},
		
		
		
		prompt:
		{
			"deps":
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
		},
		
		
		
		shell:
		{
			"npm-install":   { command:"npm install" },
			"npm-update":    { command:"npm update" }
		}
	});
	
	
	
	grunt.registerTask("deps", ["content:deps","prompt:deps"]);
	
	grunt.registerTask("deps-install", ["clean:deps","shell:npm-install","bower:install"]);
	grunt.registerTask("deps-update",  ["shell:npm-update","bower:update"]);
	
	
	
};

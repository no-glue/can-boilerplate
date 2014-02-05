var cliClear = require("cli-clear");
var cliTable = require("cli-table");

var BowerDependencies = require("./BowerDependencies");
var AnswersInfo = require("./AnswersInfo");



module.exports = function(grunt)
{
	var bowerDependencies = new BowerDependencies(grunt);
	var answersInfo = new AnswersInfo(grunt);
	
	var cwd = grunt.option("custom_cwd");
	
	var bowerFile   = "client/bower.json";
	var packageFile = "client/package.json";
	
	
	
	// Some tasks needs different delimiters to avoid conflicts
	grunt.template.addDelimiters("templated-templates", "{%", "%}");
	
	
	
	grunt.initConfig(
	{
		info: grunt.file.readJSON("package.json"),
		
		bwr: grunt.file.readJSON("root/"+bowerFile),
		pkg: grunt.file.readJSON("root/"+packageFile),
		
		
		
		// Prompt answers (and more)
		cfg:
		{
			deps:
			{
				css:
				{
					dynamic:
					{
						"extras": [],
						"library": {name:"", path:""}
					},
					static:
					{
						preprocessor: {name:"less.js", path:""}
					}
				},
				js:
				{
					dynamic:
					{
						//"docs": {name:"", path:""},
						"extras": [],
						"library": {name:"", path:""}
					},
					static:
					{
						canjs: {name:"canjs", path:""},
						loader: {name:"requirejs", path:""},
						loaderShim: {name:"almond", path:""}
					}
				}
			},
			//testingFlavour: ""
		},
		
		
		
		// Tasks
		
		
		
		copy:
		{
			"project":
			{
				files:
				[
					{ cwd:"root/", src:["**","!.npmignore"], dest:cwd+"/", expand:true, dot:true }
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
							config: "bypassNonEmptyDir",
							type: "confirm",
							message: "This directory is not empty!".red+" Continue anyway?",
							default: false,
							displayAsDefault: false,	// custom
							when: function(answers)
							{
								var cwdContents = require("fs").readdirSync(cwd);
								
								if (cwdContents.length)
								{
									if (cwdContents.length == 1)
									{
										// Ignores .DS_Store
										// TODO :: check for hidden Windows files
										if (cwdContents[0] == ".DS_Store")
										//if (cwdContents[0].substr(0,1) == ".")
										{
											return false;
										}
									}
									
									return true;
								}
								
								return false;
							}
						},
						{
							config: "defaultSettings",
							type: "confirm",
							message: "Use the default settings listed above?",
							default: true,
							displayAsDefault: false,	// custom
							when: function(answers)
							{
								// TODO :: this is a workaround for filter/validate not working with type:confirm
								if ( answers["bypassNonEmptyDir"] === false )
								{
									// Headers temporarily hidden.. needs space
									grunt.log.writeln("");
									
									process.exit();
								}
								
								return true;
							}
						},
						{
							config: "pkg.version",
							type: "input",
							message: "Current version",
							default: "<%= pkg.version %>",
							displayAsDefault: false	// custom
						},
						/*{
							config: "cfg.deps.js.dynamic.canjs",
							type: "checkbox",
							message: "CanJS plugins:",
							choices: [
								{ name:"can-crawl" },
								{ name:"can-transition" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},*/
						{
							config: "cfg.deps.js.dynamic.library.name",
							type: "list",
							message: "JS library",
							default: 2,
							choices: [
								//{ name:"None (standalone)", value:"-" },
								//"---",
								{ name:"jQuery 1.x", value:"jquery#1.x" },
								{ name:"jQuery 2.x", value:"jquery" },
								{ name:"Zepto", value:"git://github.com/components/zepto.git" },	// seriously, wtf is this shit?;
								{ name:"Dojo", value:"dojo" },
								{ name:"MooTools", value:"mootools" },
								{ name:"YUI", value:"yui" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "cfg.deps.js.dynamic.extras",
							type: "checkbox",
							message: "JS extras",
							choices: [
								//{ name:"jQuery++", value:"jquerypp" },
								{ name:"jQuery UI", value:"jquery.ui" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "cfg.deps.css.dynamic.library.name",
							type: "list",
							message: "LESS/CSS library",
							default: 1,
							choices: [
								{ name:"Twitter Bootstrap", value:"bootstrap" },
								{ name:"YUI Pure", value:"pure" },
								{ name:"Zurb Foundation", value:"foundation" },
								"---",
								{ name:"None", value:"-" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "cfg.deps.css.dynamic.extras",
							type: "checkbox",
							message: "LESS extras",
							choices: [
								{ name:"Lots of Love for LESS (3L)", value:"3l", checked:true }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						/*{
							config: "cfg.testingFlavour",
							type: "list",
							message: "Mocha/FuncUnit flavour",
							default: 0,
							choices: [
								{ name:"BDD (like Jasmine)", value:"bdd" },
								{ name:"TDD", value:"tdd" },
								{ name:"Require (custom)", value:"require" },
								{ name:"QUnit", value:"qunit" },
								{ name:"Exports (like Expresso)", value:"exports" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},*/
						/*{
							config: "cfg.deps.js.dynamic.docs.name",
							type: "list",
							message: "Documentation engine",
							default: 0,
							choices: [
								{ name:"DocumentJS", value:"documentjs" },
								{ name:"YUIDoc", value:"yuidoc" },
								"---",
								{ name:"None", value:"-" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},*/
						/*{
							config: "cfg.server.dev",
							type: "list",
							message: "Development server",
							default: 0,
							choices: [
								{ name:"Node", value:"node" },
								{ name:"Nginx", value:"nginx" },
								{ name:"Apache", value:"apache" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "cfg.server.dist",
							type: "list",
							message: "Production server",
							default: 0,
							choices: [
								{ name:"Node", value:"node" },
								{ name:"Nginx", value:"nginx" },
								{ name:"Apache", value:"apache" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},*/
						/*{
							config: "saveSettings",
							type: "confirm",
							message: "Save these settings?",
							default: true,
							displayAsDefault: false,	// custom
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						}*/
					],
					then: function(results)
					{
						bowerDependencies.populate( "bwr.dependencies", answersInfo.getDepsList("cfg.deps") );
						
						//console.log( require("util").inspect(grunt.config("cfg"),false,null) );
						
						// Show headers
						grunt.log.header = grunt.log.header_backup;
					}
				}
			}
		},
		
		
		
		template:
		{
			"compile":
			{
				options:
				{
					delimiters: "templated-templates",
					data:
					{
						"loaderShim": "<%= cfg.deps.js.static.loaderShim.path %>"
					}
				},
				src:  cwd+"/client/tools/lib/compile.js",
				dest: cwd+"/client/tools/lib/compile.js"
			},
			"gruntfile":
			{
				options:
				{
					delimiters: "templated-templates",
					data:
					{
						"title":   "<%= info.name.toUpperCase() %>",
						"version": "<%= info.version %>"
					}
				},
				src:  cwd+"/client/Gruntfile.js",
				dest: cwd+"/client/Gruntfile.js"
			},
			"index":
			{
				options:
				{
					data:
					{
						"less":    "<%= cfg.deps.css.static.preprocessor.path %>",
						"require": "<%= cfg.deps.js.static.loader.path %>"
					}
				},
				src:  cwd+"/client/private/index.html",
				dest: cwd+"/client/private/index.html"
			},
			"init-js":
			{
				options:
				{
					data:
					{
						"library": "<%= cfg.deps.js.dynamic.library %>",
						"extras":  "<%= cfg.deps.js.dynamic.extras %>"
					}
				},
				src:  cwd+"/client/private/init.js",
				dest: cwd+"/client/private/init.js"
			},
			"init-less":
			{
				options:
				{
					data:
					{
						"library": "<%= cfg.deps.css.dynamic.library %>",
						"extras":  "<%= cfg.deps.css.dynamic.extras %>"
					}
				},
				src:  cwd+"/client/private/init.less",
				dest: cwd+"/client/private/init.less"
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-prompt");
	grunt.loadNpmTasks("grunt-template");
	
	
	
	// Hide headers
	grunt.log.header_backup = grunt.log.header;
	grunt.log.header = function(){}
	
	
	
	grunt.registerTask("farewell", "", function()
	{
		grunt.log.writeln("Be sure to examine these files for accuracy:".yellow);
		grunt.log.writeln("");
		grunt.log.writeln("  client/private/init.js".yellow);
		grunt.log.writeln("  client/private/init.less".yellow);
	});
	
	
	
	grunt.registerTask("install", "Install Node and Bower dependencies.", function()
	{
		require(cwd+"/client/tools/lib/index").init( this.async() );
	});
	
	
	
	grunt.registerTask("template-preparation", "Prepare template data.", function()
	{
		var deps = grunt.config("cfg.deps");
		
		deps = answersInfo.eachEveryAnswer(deps, function(answer)
		{
			// Avoid showing log errors for intentionally empty dependencies
			if (answer.name != "")
			{
				var name = bowerDependencies.parseGitURL(answer.name).name;	// in case it's a URL
				var path = bowerDependencies.getInstalledPath(name, cwd);
				
				if (path.error)
				{
					grunt.log.error('Could not resolve path for "'+name+'"');
				}
				
				answer.name = name;
				answer.path = path.path;
			}
			
			return answer;
		});
		
		grunt.config("cfg.deps", deps);
	});
	
	
	
	grunt.registerTask("tools-permissions", "Set ownership of certain files.", function()
	{
		function logChanges(count)
		{
			var s = (!count || count>1) ? "s" : "";
			
			grunt.log.writeln("Modified "+count.toString().cyan+" file"+s);
		}
		
		// *.command files need ownership  --  https://discussions.apple.com/message/16030281#16030281
		// TODO find out about *.sh files
		if ( process.platform.indexOf("win") >= 0 )
		{
			var done = this.async();
			
			require("child_process").exec('chmod u+x "'+cwd+'"/client/tools/*.command', function(error, stdout, stderr)
			{
				logChanges(1);
				
				done();
			});
		}
		else
		{
			logChanges(0);
		}
	});
	
	
	
	grunt.registerTask("welcome", "", function()
	{
		var done = this.async();
		
		cliClear( function()
		{
			var description = "PROJECT GENERATOR".underline+" ("+grunt.config("info.name")+" v"+grunt.config("info.version")+")";
			description += "\n\nThis automatically includes latest versions of CanJS, RequireJS and";
			description += "\nLESS. Some other optional modules are available as well.";
			description += "\n\n"+"Make sure that you're in the directory you want to scaffold into.".yellow;
			
			var table = new cliTable({ colWidths:[72] });
			
			table.push( [description], [answersInfo.getDefaults("prompt.config.options.questions")] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("write-json", "Save changes to JSON files.", function()
	{
		grunt.file.write(cwd+"/"+bowerFile,   JSON.stringify(grunt.config("bwr"),null,"  "));
		grunt.file.write(cwd+"/"+packageFile, JSON.stringify(grunt.config("pkg"),null,"  "));
		
		grunt.log.writeln("Modified "+"2".cyan+" files");
	});
	
	
	
	grunt.registerTask("default",
	[
		"welcome",
		"prompt",
		
		"copy",
		"tools-permissions",
		"write-json",
		"install",
		"template-preparation",
		"template",
		
		"farewell"
	]);
	
	
	
};

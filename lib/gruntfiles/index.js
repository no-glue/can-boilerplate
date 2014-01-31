var cliClear = require("cli-clear");
var cliTable = require("cli-table");

var BowerDependencies = require("./BowerDependencies");
var DefaultConfig = require("./DefaultConfig");



module.exports = function(grunt)
{
	var bowerDependencies = new BowerDependencies(grunt);
	var defaultConfig = new DefaultConfig(grunt);
	
	var cwd = grunt.option("custom_cwd");
	
	var bowerFile   = "client/bower.json";
	var packageFile = "client/package.json";
	
	
	
	// Some takss needs different delimiters to avoid conflicts
	grunt.template.addDelimiters("templated-templates", "{%", "%}");
	
	
	
	grunt.initConfig(
	{
		info: grunt.file.readJSON("package.json"),
		
		cfg: {},	// default settings
		
		bwr: grunt.file.readJSON("root/"+bowerFile),
		pkg: grunt.file.readJSON("root/"+packageFile),
		
		
		
		copy:
		{
			"project":
			{
				files:
				[
					{ cwd:"root/", src:["**"], dest:cwd+"/", expand:true, dot:true }
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
						/*{
							config: "pkg.name",
							type: "input",
							message: "What's the title of your project?",
							default: "<%= pkg.name %>",
							displayAsDefault: false	// custom
						},
						{
							config: "pkg.description",
							type: "input",
							message: "Project description",
							default: "<%= pkg.description %>",
							displayAsDefault: false	// custom
						},*/
						{
							config: "pkg.version",
							type: "input",
							message: "Current version",
							default: "<%= pkg.version %>",
							displayAsDefault: false	// custom
						},
						/*{
							config: "cfg.deps.js.canjs",
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
							config: "cfg.deps.js.library",
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
							config: "cfg.deps.js.plugins",
							type: "checkbox",
							message: "JS extras",
							choices: [
								{ name:"jQuery UI", value:"jquery.ui" }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "cfg.deps.css.library",
							type: "list",
							message: "LESS/CSS dependencies",
							default: 1,
							choices: [
								{ name:"Twitter Bootstrap", value:"bootstrap" },
								{ name:"YUI Pure", value:"purecss" },
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
							config: "cfg.deps.css.mixins",
							type: "checkbox",
							message: "LESS mixins",
							choices: [
								{ name:"Lots of Love for LESS (3L)", value:"3l", checked:true }
							],
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						/*{
							config: "cfg.testing",
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
							config: "cfg.documentation",
							type: "list",
							message: "Documentation engine",
							default: 0,
							choices: [
								{ name:"DocumentJS", value:"documentjs" },
								{ name:"YUIDoc", value:"yuidoc" },
								"---",
								{ name:"None", value:"" }
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
						bowerDependencies.populate("bwr.dependencies", "cfg.deps");
						
						// Show headers
						grunt.log.header = grunt.log.header_backup;
					}
				}
			}
		},
		
		
		
		template:
		{
			"gruntfile":
			{
				options:
				{
					delimiters: "templated-templates",
					data:
					{
						//"title": "<%= info.name.toUpperCase() %>",
						//"version": "<%= info.version %>"
						
						"title": "WTF",
						"version": "0.0.0"
					}
				},
				src:  cwd+"/client/Gruntfile.js",
				dest: cwd+"/client/Gruntfile.js"
			},
			/*"index":
			{
				options:
				{
					data:
					{
						"less": "",
						"require": ""
					}
				},
				src:  cwd+"/client/private/index.html",
				dest: cwd+"/client/private/index.html"
			},*/
			"init-js":
			{
				options:
				{
					data:
					{
						"library": {name:"<%= cfg.deps.js.library.value %>", path:""},
						"plugins": "<%= cfg.deps.js.plugins %>"
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
						"library": {name:"<%= cfg.deps.css.library.value %>", path:""},
						"mixins": "<%= cfg.deps.css.mixins %>"
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
	
	
	
	grunt.registerTask("install", "", function()
	{
		require(cwd+"/client/tools/lib/index").init( this.async() );
	});
	
	
	
	grunt.registerTask("template-preparation", "", function()
	{
		function restructureDepList(configLocation)
		{
			var list = grunt.config(configLocation);
			
			for (var i=0; i<list.length; i++)
			{
				list[i] = {
					"name": list[i],
					"path": bowerDependencies.getInstalledPath( list[i] , cwd )
				};
			}
			
			grunt.config(configLocation, list);
		}
		
		
		var jsData   = "template.init-js.options.data";
		var lessData = "template.init-less.options.data";
		
		[jsData,lessData].forEach( function(element, index, array)
		{
			var name = grunt.config(element+".library.name");
			
			// Had to use "-" because "" caused `.value` to be subsituted with `.name` in grunt-prompt
			if (name != "-")
			{
				// In case it's a URL
				name = bowerDependencies.parseGitURL(name).name;
				
				grunt.config(element+".library.path", bowerDependencies.getInstalledPath(name,cwd) );
			}
			else
			{
				name = "";
			}
			
			grunt.config(element+".library.name", name);
		});
		
		restructureDepList(jsData+".plugins");
		restructureDepList(lessData+".mixins");
	});
	
	
	
	grunt.registerTask("tools-permissions", "", function()
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
			
			table.push( [description], [defaultConfig.get("prompt.config.options.questions")] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("write-json", "", function()
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
		"template"
	]);
	
	
	
};

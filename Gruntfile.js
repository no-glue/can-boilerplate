module.exports = function(grunt)
{
	var util = require("./lib/util")(grunt);
	
	
	
	grunt.initConfig(
	{
		cfg:
		{
			generator:
			{
				cwd: grunt.option("custom_cwd"),	// path to generate into
				pkg: grunt.file.readJSON("package.json")
			},
			project:
			{
				bwr_output: "<%= cfg.generator.cwd %>/client/bower.json",
				pkg_output: "<%= cfg.generator.cwd %>/client/package.json",
				bwr: grunt.file.readJSON("root/client/bower.json"),
				pkg: grunt.file.readJSON("root/client/package.json"),
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
							preprocessor:     {name:"less.js", path:""},
							postpreprocessor: {name:"myth", path:""}
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
				tests:
				{
					assertion: "",
					dsl: ""
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		content: 
		{
			options:
			{
				table:
				{
					colWidths: [72]
				}
			},
			"farewell":
			{
				text:	 "Be sure to examine these files for accuracy:".yellow
						+"\n"
						+"\n  client/private/init.js".yellow
						+"\n  client/private/init.less".yellow
			},
			"welcome":
			{
				options:
				{
					clearBefore: true
				},
				table:
				[
					[
						[
							 "PROJECT GENERATOR".underline+" (<%= cfg.generator.pkg.name %> v<%= cfg.generator.pkg.version %>)"
							+"\n\nThis automatically includes latest versions of CanJS, RequireJS and"
							+"\nLess.js. Some other optional modules are available as well."
							+"\n\n"+"Make sure that you're in the directory you want to scaffold into.".yellow
						]
					],
					function()
					{
						return [ [[util.answersInfo.getDefaults("prompt.config.options.questions")]] ];
					}
				]
			}
		},
		
		
		
		copy:
		{
			"project":
			{
				files:
				[
					{ cwd:"root/", src:["**","!.npmignore"], dest:"<%= cfg.generator.cwd %>/", expand:true, dot:true }
				]
			}
		},
		
		
		
		prompt:
		{
			options:
			{
				gruntLogHeader: false
			},
			"config":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.generator.bypassNonEmptyDir",
							type: "confirm",
							message: "This directory is not empty!".red+" Continue anyway?",
							default: false,
							when: util.prompt.cwdIsEmpty,
							displayAsDefault: false	// custom
						},
						{
							config: "cfg.generator.defaultSettings",
							type: "confirm",
							message: "Use the default settings listed above?",
							default: true,
							when: util.prompt.notBypassNonEmptyDir,
							displayAsDefault: false	// custom
						},
						{
							config: "cfg.project.pkg.version",
							type: "input",
							message: "Current version",
							default: "<%= cfg.project.pkg.version %>",
							displayAsDefault: false	// custom
						},
						/*{
							config: "cfg.project.deps.js.dynamic.canjs",
							type: "checkbox",
							message: "CanJS plugins:",
							choices: [
								{ name:"can-crawl" },
								{ name:"can-transition" }
							],
							when: util.prompt.notDefaultSettings
						},*/
						{
							config: "cfg.project.deps.js.dynamic.library.name",
							type: "list",
							message: "JS library",
							default: 2,
							choices: [
								//{ name:"None (standalone)", value:"-" },
								//"---",
								{ name:"jQuery 1.x", value:"jquery#1.x" },
								{ name:"jQuery 2.x", value:"jquery" },
								{ name:"Zepto", value:"git://github.com/components/zepto.git" },	// seriously, wtf is this shit?
								{ name:"Dojo", value:"dojo" },
								{ name:"MooTools", value:"mootools" },
								{ name:"YUI", value:"yui" }
							],
							when: util.prompt.notDefaultSettings
						},
						{
							config: "cfg.project.deps.js.dynamic.extras",
							type: "checkbox",
							message: "JS extras",
							choices: [
								{ name:"jQuery++", value:"jquerypp-release" },
								{ name:"jQuery UI", value:"jquery.ui" }
							],
							when: util.prompt.notDefaultSettings
						},
						{
							config: "cfg.project.deps.css.dynamic.library.name",
							type: "list",
							message: "CSS library",
							default: 1,
							choices: [
								{ name:"Twitter Bootstrap", value:"bootstrap" },
								{ name:"YUI Pure", value:"pure" },
								{ name:"Zurb Foundation", value:"foundation" },
								"---",
								{ name:"None", value:"-" }
							],
							when: util.prompt.notDefaultSettings
						},
						/*{
							config: "cfg.project.deps.css.dynamic.extras",
							type: "checkbox",
							message: "CSS extras",
							choices: [
								{ name:"Lots of Love for Less (3L)", value:"3l", checked:true }
							],
							when: util.prompt.notDefaultSettings
						},*/
						{
							config: "cfg.project.tests.dsl",
							type: "list",
							message: "Mocha/FuncUnit language (DSL)",
							default: 0,
							choices: [
								{ name:"Behavior-driven (like Jasmine)", value:"bdd" },
								{ name:"Test-driven", value:"tdd" },
								{ name:"Require (custom)", value:"require" },
								{ name:"QUnit", value:"qunit" },
								{ name:"Exports (like Expresso)", value:"exports" }
							],
							when: util.prompt.notDefaultSettings
						},
						{
							config: "cfg.project.tests.assertion",
							type: "list",
							message: "Mocha/FuncUnit assertion style",
							default: 0,
							choices: [
								{ name:"Expect (like Jasmine)", value:"expect" },
								{ name:"Should", value:"should" },
								{ name:"Assert (similar to QUnit)", value:"assert" }
							],
							when: util.prompt.notDefaultSettings
						},
						/*{
							config: "cfg.project.deps.js.dynamic.docs.name",
							type: "list",
							message: "Documentation engine",
							default: 0,
							choices: [
								{ name:"DocumentJS", value:"documentjs" },
								{ name:"YUIDoc", value:"yuidoc" },
								"---",
								{ name:"None", value:"-" }
							],
							when: util.prompt.notDefaultSettings
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
							when: util.prompt.notDefaultSettings
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
							when: util.prompt.notDefaultSettings
						},*/
						/*{
							config: "saveSettings",
							type: "confirm",
							message: "Save these settings?",
							default: true,
							when: util.prompt.notDefaultSettings,
							displayAsDefault: false	// custom
						}*/
					],
					then: util.prompt.complete
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
						"loaderShim": "<%= cfg.project.deps.js.static.loaderShim.path %>"
					}
				},
				src:  "<%= cfg.generator.cwd %>/client/tools/lib/tasks/compile.js",
				dest: "<%= cfg.generator.cwd %>/client/tools/lib/tasks/compile.js"
			},
			"gruntfile":
			{
				options:
				{
					delimiters: "templated-templates",
					data:
					{
						"title":   "<%= cfg.generator.pkg.name.toUpperCase() %>",
						"version": "<%= cfg.generator.pkg.version %>"
					}
				},
				src:  "<%= cfg.generator.cwd %>/client/Gruntfile.js",
				dest: "<%= cfg.generator.cwd %>/client/Gruntfile.js"
			},
			"index":
			{
				options:
				{
					data:
					{
						"less":    "<%= cfg.project.deps.css.static.preprocessor.path %>",
						"myth":    "<%= cfg.project.deps.css.static.postpreprocessor.path %>",
						"require": "<%= cfg.project.deps.js.static.loader.path %>"
					}
				},
				src:  "<%= cfg.generator.cwd %>/client/private/index.html",
				dest: "<%= cfg.generator.cwd %>/client/private/index.html"
			},
			"init-js":
			{
				options:
				{
					data:
					{
						"library": "<%= cfg.project.deps.js.dynamic.library %>",
						"extras":  "<%= cfg.project.deps.js.dynamic.extras %>"
					}
				},
				src:  "<%= cfg.generator.cwd %>/client/private/init.js",
				dest: "<%= cfg.generator.cwd %>/client/private/init.js"
			},
			"init-less":
			{
				options:
				{
					data:
					{
						"library": "<%= cfg.project.deps.css.dynamic.library %>",
						"extras":  "<%= cfg.project.deps.css.dynamic.extras %>"
					}
				},
				src:  "<%= cfg.generator.cwd %>/client/private/init.less",
				dest: "<%= cfg.generator.cwd %>/client/private/init.less"
			},
			"test":
			{
				options:
				{
					data:
					{
						"assertion": "<%= cfg.project.tests.assertion %>",
						"dsl":       "<%= cfg.project.tests.dsl %>",
						"library":   "<%= cfg.project.deps.js.dynamic.library %>"
					}
				},
				src:  "<%= cfg.generator.cwd %>/client/private/test/test.html",
				dest: "<%= cfg.generator.cwd %>/client/private/test/test.html"
			}
		}
	});
	
	
	
	require("grunt-log-headers")(grunt);
	
	grunt.loadNpmTasks("grunt-content");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-prompt");
	grunt.loadNpmTasks("grunt-template");
	
	grunt.loadTasks("lib/tasks");
	
	// Some tasks needs different delimiters to avoid conflicts
	grunt.template.addDelimiters("templated-templates", "{%", "%}");
	
	
	
	grunt.registerTask("default",
	[
		"content:welcome",
		"prompt",
		
		"copy",
		"tools-permissions",
		"write-json",
		"install",
		"template-preparation",
		"template",
		
		"content:farewell"
	]);
	
	
	
};

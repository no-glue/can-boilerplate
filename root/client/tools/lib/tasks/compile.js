module.exports = function(grunt)
{
	var util = require("can-boilerplate-utils").compile;
	
	
	
	grunt.mergeConfig(
	{
		cfg:
		{
			sections:
			{
				"compile":
				{
					defaultSettings: true,
					saveSettings: true
				}
			}
		},
		
		
		
		// Tasks
		
		
		
		cancompile:
		{
			"compile":
			{
				src: "<%= cfg.devFolder %>/components/**/*.mustache",
				out: "<%= cfg.distFolder %>/app.templates.js",
				wrapper: 'define(["can/view/mustache"], function(can) {\n{{{content}}}\n});',
				
				normalizer: function(filename)
				{
					return filename.replace( grunt.template.process("<%= cfg.devFolder %>"), "" );
				}
			}
		},
		
		
		
		clean:
		{
			"compile-post":
			{
				src: "<%= cfg.distFolder %>/app.templates.js"
			},
			"compile-pre":
			{
				files:
				[
					{ src:"<%= cfg.distFolder %>/*", dot:true }
				]
			}
		},
		
		
		
		cleanempty:
		{
			"compile-assets":
			{
				src: "<%= cfg.distFolder %>/media/**/*"
			},
			"compile-root":
			{
				options:
				{
					files: false	// in case something's empty, easier to debug
				},
				src: "<%= cfg.distFolder %>/**/*"
			}
		},
		
		
		
		compress:
		{
			"compile":
			{
				options:
				{
					mode: "gzip"
				},
				files:
				[
					{ cwd:"<%= cfg.distFolder %>", src:"*.css", dest:"<%= cfg.distFolder %>", ext:".css.gz", expand:true },
					
					{ cwd:"<%= cfg.distFolder %>", src:"*.js",  dest:"<%= cfg.distFolder %>", ext:".js.gz", expand:true }
				]
			}
		},
		
		
		
		config:
		{
			"compile-appRoot":
			{
				options:
				{
					variables:
					{
						"includereplace.compile.options.globals.appRoot": "<%= cfg.pkg.appData.appRoot %><%= includereplace.compile.options.globals.appRoot %>",
						"less.compile.options.rootpath":                  "<%= cfg.pkg.appData.appRoot %><%= less.compile.options.rootpath %>"
					}
				}
			},
			"compile-sourceMaps":
			{
				options:
				{
					variables:
					{
						"less.compile.options.sourceMap":                 "<%= cfg.pkg.appData.generateSourceMaps %>",
						"requirejs.compile.options.generateSourceMaps":   "<%= cfg.pkg.appData.generateSourceMaps %>",
						"uglify.compile.options.sourceMap":               "<%= cfg.pkg.appData.generateSourceMaps %>",
						"uglify.compile.options.sourceMapIncludeSources": "<%= cfg.pkg.appData.generateSourceMaps %>"
					}
				}
			}
		},
		
		
		
		content: 
		{
			"compile":
			{
				table:
				[
					[
						[
							 "PRODUCTION COMPILER".underline+" <%= cfg.title_sub %>"
							+"\n\nThis will minify+compress all dependencies (css,js,etc)"
							+"\nfrom: "+"<%= cfg.devFolder %>/".yellow
							+"\ninto: "+"<%= cfg.distFolder %>/".yellow
						]
					],
					function()
					{
						var defaults = "";
						var validCount = 0;
						
						grunt.config("prompt.compile.options.questions").forEach( function(question)
						{
							if (question.displayAsDefault !== false)
							{
								if(validCount++) defaults += "\n";
								
								defaults += question.message+": "+question.default.toString().cyan;
							}
						});
						
						return [ [defaults] ];
					}
				]
			}
		},
		
		
		
		copy:
		{
			"compile":
			{
				files:
				[
					{ cwd:"<%= cfg.devFolder %>/media/", src:["**","!*-embedded/**"], dest:"<%= cfg.distFolder %>/media/", expand:true }
				]
			}
		},
		
		
		
		cssmin:
		{
			"compile":
			{
				options:
				{
					banner: "/* v<%= cfg.pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					keepSpecialComments: 0
				},
				src:  "<%= cfg.distFolder %>/app.css",
				dest: "<%= cfg.distFolder %>/app.css"
			}
		},
		
		
		
		includereplace:
		{
			options:
			{
				prefix: "{{",
				suffix: "}}"
			},
			"compile":
			{
				options:
				{
					globals:
					{
						appRoot:     "",	// gets prefixed in prompt:compile
						version:     "<%= cfg.pkg.version %>"
					}
				},
				src:  "<%= cfg.devFolder %>/index.production.html",
				dest: "<%= cfg.distFolder %>/index.html"
			}
		},
		
		
		
		less:
		{
			"compile":
			{
				options:
				{
					cleancss: true,
					compress: true,
					//strictMath: true,	// can't compile bootstrap 3.0.3 when true
					
					rootpath: "",	// gets prefixed in prompt:compile
					
					sourceMap: true,	// gets changed in prompt:compile
					sourceMapFilename: "<%= cfg.distFolder %>/app.css.map",
					sourceMapURL: "<%= cfg.pkg.appData.appRoot %>app.css.map",
					//sourceMapBasepath: "<%= cfg.pkg.appData.appRoot %>",	// DOES NOTHING in contrib-less v0.9.0
					outputSourceFiles: true
				},
				//cleancssOptions:
				//{
					//banner: "/* <%= cfg.pkg.name %> v<%= cfg.pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					//keepSpecialComments: 0
				//},
				src:  "<%= cfg.devFolder %>/init.less",
				dest: "<%= cfg.distFolder %>/app.css"
			}
		},
		
		
		
		myth:
		{
			"compile":
			{
				// TODO :: source maps
				src:  "<%= cfg.distFolder %>/app.css",
				dest: "<%= cfg.distFolder %>/app.css"
			}
		},
		
		
		
		prompt:
		{
			"compile":
			{
				options:
				{
					questions:
					[
						{
							config: "cfg.sections.compile.defaultSettings",
							type: "confirm",
							message: "Use the default settings listed above?",
							default: "<%= cfg.sections.compile.defaultSettings %>",
							displayAsDefault: false	// custom
						},
						{
							config: "cfg.pkg.version",
							type: "input",
							message: "Release version",
							default: "<%= cfg.pkg.version %>",
							when: util.prompt.notDefaultSettings
						},
						{
							config: "cfg.pkg.appData.appRoot",
							type: "input",
							message: "Production app root",
							default: "<%= cfg.pkg.appData.appRoot %>",
							when: util.prompt.notDefaultSettings
						},
						{
							config: "cfg.pkg.appData.generateSourceMaps",
							type: "confirm",
							message: "Generate source maps?",
							default: "<%= cfg.pkg.appData.generateSourceMaps %>",
							when: util.prompt.notDefaultSettings
						},
						{
							config: "cfg.sections.compile.saveSettings",
							type: "confirm",
							message: "Save these settings?",
							default: "<%= cfg.sections.compile.saveSettings %>",
							when: util.prompt.notDefaultSettings,
							displayAsDefault: false	// custom
						}
					],
					then: function(results)
					{
						if ( grunt.config("cfg.sections.compile.saveSettings") )
						{
							grunt.file.write(grunt.config("cfg.pkgFile"), JSON.stringify(grunt.config("cfg.pkg"),null,"  "));
						}
					}
				}
			}
		},
		
		
		
		requirejs:
		{
			"compile":
			{
				options:
				{
					optimize: "none",
					generateSourceMaps: true,	// gets changed in prompt:compile
					
					baseUrl: "<%= cfg.devFolder %>",{% if (loaderShim) { %}
					name: "{%= loaderShim.substr(0, loaderShim.lastIndexOf('.js')) %}",{% } %}
					include: "init",
					out: "<%= cfg.distFolder %>/app.js",
					
					mainConfigFile: "<%= cfg.devFolder %>/init.js",
					paths:
					{
						templates: "../"+"<%= cfg.distFolder %>/app.templates"
					}
				}
			}
		},
		
		
		
		uglify:
		{
			"compile":
			{
				options:
				{
					banner: "/* v<%= cfg.pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					sourceMap: true,	// gets changed in prompt:compile
					sourceMapIn:   "<%= cfg.distFolder %>/app.js.map",	// input from requirejs
					sourceMapName: "<%= cfg.distFolder %>/app.js.map",	// output
					sourceMapIncludeSources: true
				},
				src:  "<%= cfg.distFolder %>/app.js",
				dest: "<%= cfg.distFolder %>/app.js"
			}
		}
	});
	
	
	
	grunt.registerTask("compile",
	[
		"config:compile-appRoot",		// apply defaults (or answers from prompt)
		"config:compile-sourceMaps",	// apply defaults (or answers from prompt)
		"clean:compile-pre",			// empty dist
		"copy:compile",					// copy assets to dist
		"cleanempty:compile-assets",	// remove empty assets
		"cleanempty:compile-root",		// remove empty folders
		"includereplace:compile",		// copy specific files to dist with inserted variables
		
		"less:compile",					// compile less to css
		"myth:compile",					// add browser support to new css features
		"cssmin:compile",				// minify css further (removes redundancies and special comments)
		
		"cancompile:compile",			// compile templates
		"requirejs:compile",			// compile app and merge with compiled templates
		"uglify:compile",				// minifies smaller than requirejs and with far less configuring, plus has a banner option
		"clean:compile-post",			// remove compiled templates file and source map
		
		"compress:compile"				// gzip css and js
	]);
	
	grunt.registerTask("compile-w-menu", ["content:compile","prompt:compile","compile"]);
	
	
	
};

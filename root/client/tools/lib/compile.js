var cliClear = require("cli-clear");
var cliTable = require("cli-table");
var path = require("path");



module.exports = function(grunt, cwd, title)
{
	var dev  = path.resolve("private/");
	var dist = path.resolve("public/");
	
	var packageFile = "package.json";
	
	
	
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON(packageFile),
		
		
		
		cancompile:
		{
			"templates":
			{
				src: dev+"/components/**/*.mustache",
				out: dist+"/app.templates.js",
				wrapper: 'define(["can/view/mustache"], function(can) {\n{{{content}}}\n});',
				
				normalizer: function(filename)
				{
					return filename.replace(dev, "");
				}
			}
		},
		
		
		
		clean:
		{
			options:
			{
				force: true
			},
			"post":
			{
				src: dist+"/app.templates.js"
			},
			"pre":
			{
				files:
				[
					{ src:dist+"/*", dot:true }
				]
			}
		},
		
		
		
		cleanempty:
		{
			options:
			{
				force: true
			},
			"assets":
			{
				src: dist+"/media/**/*"
			},
			"app root":
			{
				options:
				{
					files: false	// in case something's empty, easier to debug
				},
				src: dist+"/**/*"
			}
		},
		
		
		
		compress:
		{
			"css/js":
			{
				options:
				{
					mode: "gzip"
				},
				files:
				[
					{ cwd:dist, src:"*.css", dest:dist, ext:".css.gz", expand:true },
					
					{ cwd:dist, src:"*.js", dest:dist, ext:".js.gz", expand:true }
				]
			}
		},
		
		
		
		copy:
		{
			"assets":
			{
				files:
				[
					{ cwd:dev+"/media/", src:["**","!*-embedded/**"], dest:dist+"/assets/", expand:true }
				]
			}
		},
		
		
		
		cssmin:
		{
			"more":
			{
				options:
				{
					banner: "/* v<%= pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					keepSpecialComments: 0
				},
				src:  dist+"/app.css",
				dest: dist+"/app.css"
			}
		},
		
		
		
		includereplace:
		{
			options:
			{
				prefix: "{{",
				suffix: "}}"
			},
			/*"apache":
			{
				options:
				{
					globals:
					{
						path: "index.html"	// gets prefixed
					}
				},
				src:  dev+".htaccess.production",
				dest: dist+".htaccess"
			},*/
			"html":
			{
				options:
				{
					globals:
					{
						appRoot:     "",	// gets prefixed
						version:     "<%= pkg.version %>"
					}
				},
				src:  dev+"/index.production.html",
				dest: dist+"/index.html"
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
					
					rootpath: "",	// gets prefixed
					
					sourceMap: true,	// gets changed
					sourceMapFilename: dist+"/app.css.map",
					sourceMapURL: "<%= pkg.appData.appRoot %>app.css.map",
					sourceMapBasepath: "<%= pkg.appData.appRoot %>",	// DOES NOTHING in contrib-less v0.9.0
					outputSourceFiles: true
				},
				//cleancssOptions:
				//{
					//banner: "/* <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					//keepSpecialComments: 0
				//},
				src:  dev+"/init.less",
				dest: dist+"/app.css"
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
							config: "defaultSettings",
							type: "confirm",
							message: "Use the default settings listed above?",
							default: true,
							displayAsDefault: false	// custom
						},
						{
							config: "pkg.version",
							type: "input",
							message: "Release version",
							default: "<%= pkg.version %>",
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "pkg.config.appRoot",
							type: "input",
							message: "Production app root",
							default: "<%= pkg.appData.appRoot %>",
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "pkg.config.generateSourceMaps",
							type: "confirm",
							message: "Generate source maps?",
							default: "<%= pkg.appData.generateSourceMaps %>",
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						},
						{
							config: "saveSettings",
							type: "confirm",
							message: "Save these settings?",
							default: true,
							displayAsDefault: false,	// custom
							when: function(answers)
							{
								return answers["defaultSettings"] === false;
							}
						}
					]
				}
			}
		},
		
		
		
		requirejs:
		{
			"compile+merge":
			{
				options:
				{
					optimize: "none",
					generateSourceMaps: true,	// gets changed
					
					baseUrl: dev,
					name: dev+"/vendors/almond/almond",
					include: "init",
					out: dist+"/app.js",
					
					mainConfigFile: dev+"/init.js",
					paths:
					{
						templates: dist+"/app.templates"
					}
				}
			}
		},
		
		
		
		uglify:
		{
			"js":
			{
				options:
				{
					banner: "/* v<%= pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					sourceMap: true,	// gets changed
					sourceMapIn:   dist+"/app.js.map",	// input from requirejs
					sourceMapName: dist+"/app.js.map",	// output
					sourceMapRoot: dev,
					sourceMapIncludeSources: true
				},
				src:  dist+"/app.js",
				dest: dist+"/app.js"
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("can-compile");
	grunt.loadNpmTasks("grunt-cleanempty");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-cssmin");	// won't be required when contrib-less gets cleancssOptions
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-include-replace");
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	grunt.registerTask("prompt-finished", "", function()
	{
		// App root
		var appRoot = grunt.config("pkg.config.appRoot");
		var var1 = "includereplace.html.options.globals.appRoot";
		var var2 = "includereplace.apache.options.globals.path";
		var var3 = "less.compile.options.rootpath";
		grunt.config( var1, appRoot+grunt.config(var1) );
		grunt.config( var2, appRoot+grunt.config(var2) );
		grunt.config( var3, appRoot+grunt.config(var3) );
		
		// Source maps
		if ( !grunt.config("pkg.config.generateSourceMaps") )
		{
			grunt.config( "less.compile.options.sourceMap", false );
			grunt.config( "requirejs.compile+merge.options.generateSourceMaps", false );
			grunt.config( "uglify.js.options.sourceMap", false );
			grunt.config( "uglify.js.options.sourceMapIncludeSources", false );
		}
		
		if ( grunt.config("saveSettings") )
		{
			grunt.file.write(packageFile, JSON.stringify(grunt.config("pkg"),null,"  "));
		}
		
		// Show headers
		grunt.log.header = grunt.log.header_backup;
	});
	
	
	
	grunt.registerTask("welcome", "", function()
	{
		var done = this.async();
		
		cliClear( function()
		{
			var description = "PRODUCTION COMPILE".underline;
			description += "\nThis will minify+compress all dependencies (css,js,etc)";
			description += "\nfrom: "+dev.yellow;
			description += "\ninto: "+dist.yellow;
			
			var defaults = "";
			for (var i=0, questions=grunt.config("prompt.config.options.questions"), numQuestions=questions.length; i<numQuestions; i++)
			{
				var question = questions[i];
				
				if (question.displayAsDefault !== false)
				{
					defaults += question.message+": "+question.default.toString().cyan;
					
					if (i < numQuestions-2) defaults += "\n";
				}
			}
			
			var table = new cliTable({ colWidths:[72] });
			
			table.push( [description],[defaults] );
			
			grunt.log.writeln( table.toString() );
			
			// Headers temporarily hidden.. needs space
			grunt.log.writeln("");
			
			done();
		});
	});
	
	
	
	grunt.registerTask("compile",
	[
		"welcome",
		"prompt",			// questionnaire
		"prompt-finished",
		
		"clean:pre",		// empty dist
		"copy",				// copy assets to dist
		"cleanempty",		// remove empty assets and folders
		"includereplace",	// copy html+apache files to dist with inserted variables
		
		"less",				// compile less to css
		"cssmin",			// minify css further (removes redundancies and special comments)
		
		"cancompile",		// compile templates
		"requirejs",		// compile app and merge with compiled templates
		"uglify",			// minifies smaller than requirejs and with far less configuring, plus has a banner option
		"clean:post",		// remove compiled templates file and source map
		
		"compress"			// gzip css and js
	]);
	
	
	
};

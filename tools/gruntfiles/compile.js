module.exports = function(grunt)
{
	var package = "../src/package.json";
	
	
	
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON(package),
		
		
		
		cancompile:
		{
			"templates":
			{
				src: ["../src/components/**/*.mustache"],
				out: "../bin/app.templates.js",
				wrapper: 'define(["can/view/mustache"], function(can) {\n{{{content}}}\n});',
				
				normalizer: function(filename)
				{
					return filename.replace("src/", "");
				}
			}
		},
		
		
		
		clean:
		{
			options:
			{
				force: true
			},
			"bin":
			{
				src: ["../bin/*", "../bin/.htaccess"]	// doesn't automatically remove hidden files (yet?)
			},
			"templates":
			{
				src: ["../bin/app.templates.js"]
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
				src: ["../bin/assets/**/*"]
			},
			"app root":
			{
				options:
				{
					files: false	// in case something's empty, easier to debug
				},
				src: ["../bin/**/*"]
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
					{ src:"../bin/*.css", dest:"../bin/", ext:".css.gz", expand:true },
					
					{ src:"../bin/*.js", dest:"../bin/", ext:".js.gz", expand:true }
				]
			}
		},
		
		
		
		copy:
		{
			"assets":
			{
				files:
				[
					{ cwd:"../src/assets/", src:["**","!css/**","!js/**","!media/**"], dest:"../bin/assets/", expand:true },
					
					{ cwd:"../src/assets/media/", src:["**","!*-embedded/**"], dest:"../bin/assets/media/", expand:true }
				]
			}
		},
		
		
		
		cssmin:
		{
			"more":
			{
				options:
				{
					banner: "/* <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n",
					keepSpecialComments: 0
				},
				files:
				{
					"../bin/app.css" : "../bin/app.css"
				}
			}
		},
		
		
		
		includereplace:
		{
			options:
			{
				prefix: "{{",
				suffix: "}}"
			},
			"apache":
			{
				options:
				{
					globals:
					{
						path: "index.html"	// gets prefixed
					}
				},
				files:
				{
					"../bin/.htaccess" : "../src/.htaccess.production"
				}
			},
			"html":
			{
				options:
				{
					globals:
					{
						appRoot:		"",	// gets prefixed
						description:	"<%= pkg.description %>",
						title:			"<%= pkg.name %>",
						version:		"<%= pkg.version %>"
					}
				},
				files:
				{
					"../bin/index.html" : "../src/index.production.html"
				}
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
					rootpath: "",	// gets prefixed
					strictMath: true
				},
				files:
				{
					"../bin/app.css": "../src/init.less"
				}
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
							config: "required but useless",
							type: "input",
							message: "Production app root",
							default: "<%= pkg.config.appRoot %>",
							filter: function(value)
							{
								var var1 = "includereplace.html.options.globals.appRoot";
								var var2 = "includereplace.apache.options.globals.path";
								var var3 = "less.compile.options.rootpath";
								
								grunt.config( var1, value+grunt.config(var1) );
								grunt.config( var2, value+grunt.config(var2) );
								grunt.config( var3, value+grunt.config(var3) );
								
								grunt.config("pkg.config.appRoot", value);
								
								grunt.file.write(package, JSON.stringify(grunt.config("pkg"),null,"  "));
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
					
					baseUrl: "../src/",
					name: "assets/js/almond",
					include: "init",
					out: "../bin/app.js",
					
					mainConfigFile: "../src/init.js",
					paths:
					{
						templates: "../bin/app.templates"
					}
				}
			}
		},
		
		
		
		uglify:
		{
			options:
			{
				banner: "/* <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n\n"
			},
			"js":
			{
				src: "../bin/app.js",
				dest: "../bin/app.js"
			}
		}
	});
	
	
	
	grunt.loadNpmTasks("cancompile");
	grunt.loadNpmTasks("grunt-cleanempty");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-cssmin");	// won't be required when less and contrib-less release the cleancss options update
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-include-replace");
	grunt.loadNpmTasks("grunt-prompt");
	
	
	
	grunt.log.writeln("\nPRODUCTION COMPILE");
	grunt.log.writeln("This will minify+compress all dependencies (css,js,etc) within ../src/");
	
	
	
	grunt.registerTask("default",
	[
		"prompt",			// questionnaire
		
		"clean:bin",		// empty bin
		"copy",				// copy assets to bin
		"cleanempty",		// remove empty assets and folders
		"includereplace",	// copy html+apache files to bin with inserted variables
		
		"less",				// compile less to css
		"cssmin",			// minify css further (removes redundancies and special comments)
		
		"cancompile",		// compile templates
		"requirejs",		// compile app and merge with compiled templates
		"uglify",			// minifies smaller than requirejs and with far less configuring, plus has a banner option
		"clean:templates",	// remove compiled templates file
		
		"compress"			// gzip css and js
	]);
	
	
	
};

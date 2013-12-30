module.exports = function(grunt)
{
	// SHOULD BE A PROMPT IN THE FUTURE
	var appRoot = "/bin/";
	
	
	
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON("../src/package.json"),
		
		
		
		cancompile:
		{
			"compile templates":
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
			"compiled templates file":
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
			"folders in app root":
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
			"all css/js":
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
			"more minification":
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
				suffix: "}}",
			},
			"html":
			{
				options:
				{
					globals:
					{
						appRoot:		appRoot,
						description:	"<%= pkg.description %>",
						title:			"<%= pkg.name %>"
					}
				},
				files:
				[
					{ cwd:"../src/", src:"index.production.html", dest:"../bin/", expand:true, flatten:true }
				]
			},
			"server config(s)":
			{
				options:
				{
					globals:
					{
						path: appRoot+"index.html"
					}
				},
				files:
				[
					{ cwd:"../src/", src:".htaccess.production", dest:"../bin/", expand:true, flatten:true }
				]
			}
		},
		
		
		
		less:
		{
			"compile into minified css":
			{
				options:
				{
					cleancss: true,
					compress: true,
					rootpath: appRoot,
					//rootpath: "",	// relative to output css file (not good when serving index.html to 404 pages to catch all routes)
					//rootpath: "/",	// force server root
					strictMath: true
				},
				files:
				{
					"../bin/app.css": "../src/init.less"
				}
			}
		},
		
		
		
		rename:
		{
			"html":
			{
				src: "../bin/index.production.html",
				dest: "../bin/index.html"
			},
			"server config(s)":
			{
				src: "../bin/.htaccess.production",
				dest: "../bin/.htaccess"
			}
		},
		
		
		
		requirejs:
		{
			"compile app with compiled templates":
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
				banner: "/* <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('mmm-d-yyyy') %>) */\n\n",
			},
			"the js file":
			{
				src: "../bin/app.js",
				dest: "../bin/app.js"
			}
		}
	});
	
	
	
	// won't work until grunt v0.5
	/*grunt.loadNpmTasks(
	[
		"cancompile",
		"grunt-cleanempty",
		"grunt-contrib-clean",
		"grunt-contrib-compress",
		"grunt-contrib-copy",
		"grunt-contrib-cssmin",
		"grunt-contrib-less",
		"grunt-contrib-requirejs",
		"grunt-contrib-uglify",
		"grunt-include-replace",
		"grunt-rename"
	]);*/
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
	grunt.loadNpmTasks("grunt-rename");	// won't be required when/if include-replace is updated
	
	
	
	grunt.registerTask("default",
	[
		"less",				// compile less to css
		"cssmin",			// minify css further (removes redundancies and special comments)
		"copy",				// copy assets to bin
		"includereplace",	// copy html+apache files to bin with inserted variables
		"rename",			// rename modified copied files
		
		"cancompile",		// compile templates
		"requirejs",		// compile app and merge with compiled templates
		"uglify",			// minifies smaller than requirejs and with far less configuring, plus has a banner option
		"clean",			// remove compiled templates file
		"cleanempty",		// remove empty assets and folders
		
		"compress"			// gzip css and js
	]);
	
	
	
};
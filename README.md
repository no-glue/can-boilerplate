# can-boilerplate [![NPM Version](http://badge.fury.io/js/can-boilerplate.svg)](http://badge.fury.io/js/can-boilerplate) [![Build Status](https://secure.travis-ci.org/stevenvachon/can-boilerplate.svg)](http://travis-ci.org/stevenvachon/can-boilerplate) [![Dependency Status](https://david-dm.org/stevenvachon/can-boilerplate.svg)](https://david-dm.org/stevenvachon/can-boilerplate)

> Get a head start on your [CanJS](http://canjs.com/) v2.x project.

*How it can help you:*
* Get started quickly with customized Development and Production environment "shell" files
* Avoid feeling overwhelmed with a folder structure that's simple and light but not hindering
* Save time with compilers and optimizers that do not require the use of a command line


## Getting Started

This plugin requires [Node.js](http://nodejs.org/) `~0.10`, [Xcode](https://developer.apple.com/xcode/) and a Mac.  
To install, type this at the command line:
```
npm install can-boilerplate -g
```
After that, you can generate a project any time with:
```
canbp
```
That's it. ☺︎

### It currently comes packed with:
* A project scaffolder with optional libraries:
  * [jQuery](http://jquery.com/) or [Zepto](http://jquery.com/) or others
  * [Bootstrap](http://getbootstrap.com/) or [Foundation](http://foundation.zurb.com/) or [Pure](http://purecss.io/)
  * [jQuery++](http://jquerypp.com/)
  * [jQuery UI](http://jqueryui.com/)
* [CanJS](http://canjs.com/)+[can-compile](https://github.com/daffl/can-compile), [RequireJS](http://requirejs.org/)+[almond](https://github.com/jrburke/almond), [Less.js](http://lesscss.org/)+[Myth](http://myth.io/)
* [Mocha](http://visionmedia.github.io/mocha/) + [Chai](http://chaijs.com/) + [FuncUnit](http://funcunit.com/) project testing
* [YUIDoc](http://yui.github.io/yuidoc/)
* js/css compiler+minifier and gif/png/jpg/svg optimizer
* A simple webserver that enables the use of `can.route.pushstate` on all relative 404 routes
* [Grunt](http://gruntjs.com/) + [Bower](http://bower.io/) (no need to install them globally)

### Roadmap Features:
* `0.8` add [YUIDoc](http://yui.github.io/yuidoc/)
* `0.8.x` add a lint to customize formatting
* `0.9` possibly add hooks to [Yeoman](http://yeoman.io/)
* `1.0` test on Windows
* `1.1` possibly add [StealJS](http://javascriptmvc.com/docs/stealjs.html), [SystemJS](https://github.com/systemjs/systemjs) and [transpile](https://github.com/bitovi/transpile)
* `when possible` add [DocumentJS](https://github.com/bitovi/documentjs)
* `when possible` fix source maps

---

### "Installing" a Project
Run either the `*.bat` (Windows) or `*.command` (Mac) file in `client/private/tools/` to install the build tools and all client-side dependencies. Optionally, you can manually run `npm install` within `client/`.

### Compiling a Project
Run either the `*.bat` (Windows) or `*.command` (Mac) file in `client/private/tools/`. Optionally, you can manually run `grunt compile` within `client/` to skip all menus and prompts.

![Compile example](https://raw.github.com/stevenvachon/can-boilerplate/master/misc/compile.gif)

## Project Folder Structure
````
├── client/
│   ├── node_modules/
│   ├── private/
│   │   ├── components/
│   │   │   └── example/
│   │   │       ├── helpers/
│   │   │       ├── media/
│   │   │       │   ├── backgrounds-embedded/
│   │   │       │   ├── chrome-embedded/
│   │   │       │   ├── icons-embedded/
│   │   │       │   └── textures-embedded/
│   │   │       ├── models/
│   │   │       ├── example.js
│   │   │       ├── example.less
│   │   │       └── example.mustache
│   │   ├── media/
│   │   │   ├── backgrounds/
│   │   │   ├── backgrounds-embedded/
│   │   │   ├── chrome/
│   │   │   ├── chrome-embedded/
│   │   │   ├── fonts/
│   │   │   ├── icons/
│   │   │   ├── icons-embedded/
│   │   │   ├── textures/
│   │   │   └── textures-embedded/
│   │   ├── models/
│   │   │   └── example/
│   │   │       └── example.js
│   │   ├── test/
│   │   │   ├── func.js
│   │   │   ├── test.html
│   │   │   └── unit.js
│   │   ├── vendors/
│   │   ├── index.html
│   │   ├── index.production.html
│   │   ├── init.js
│   │   └── init.less
│   ├── public/
│   ├── tools/
│   │   ├── tools.bat
│   │   └── tools.command
│   ├── bower.json
│   ├── Gruntfile.js
│   └── package.json
├── server/
└── README.md
````
`client/public/` stores your compiled/minified production-ready files.  
`client/private/` stores your source code.

`client/private/vendors/` (bower components) and `client/node_modules/` are gitignore'd. They're only added when the project is [installed](#installing-a-project).

`client/private/media/*/` stores media referenced from your CSS. Folders included in production build.  
`client/private/media/*-embedded/` stores media compiled into the production CSS file (using Less' [`data-uri()`](http://lesscss.org/functions/#misc-functions-data-uri)). Folders *excluded* in production build.

*Any* empty folders will be excluded from the production build.  
*Any* empty files in any `media/` folder will be excluded from the production build.


## FAQ
1. **Why not just set the \<script> and \<link> references to relative?**  
You could, but then the 404 routes to your index file would stop working.

2. **Why route 404s to the index file?**  
Because `can.route.pushstate` can figure out where it is in relation to its `root`. CanJS can handle most of your application from within the browser alone.

3. **Why gzip the *.js and *.css files upon compiling?**  
You don't have to rely on your webserver to do it for you. Read up on [serving pre-compressed files](http://blog.alien109.com/2009/03/17/gzip-your-javascript/).

4. **What changes must I make when moving my production environment?**  
  1. Run the compiler and change the app root value.
  2. Move files from `client/public/` to their destination.

5. **What changes must I make when moving my development environment?**  
In `client/private/index.html`, update the `<data>` tag.

6. **How can I upgrade an existing project with a new version of the tools?**
  1. Generate a temporary project in another directory.
  2. Make sure that you have not made any changes to the following in *your* project:
    * client/Gruntfile.js
    * client/package.json
    * client/tools/
  3. Replace the above mentioned files with those from the temporary project.


## Release History
* 0.8.0 added [DocumentJS](https://github.com/bitovi/documentjs), sped up dependency loading, Myth source maps, app entry point test, cleanup
* 0.7.0 added Mocha, FuncUnit and Myth, removed [3L](http://mateuszkocz.github.io/3l/), restructured tools
* 0.6.2 suggests only available ports to webserver
* 0.6.1 added [Travis CI](https://travis-ci.org/) support to projects, cleanup
* 0.6.0 now an NPM package with a scaffolder, new folder structure again
* 0.5.0 added Bower, new folder structure, merged tools
* 0.4.5 tools cleanup, added support for JavaScript and Less source maps (buggy)
* 0.4.4 tools and url-helpers cleanup
* 0.4.3 `appRoot` cleanup and Zepto support
* 0.4.2 gruntfiles cleanup
* 0.4.1 moved `appRoot` to project package file
* 0.4.0 added prompts to tools
* 0.3.1 updated to [grunt-include-replace](https://github.com/alanshaw/grunt-include-replace) v1.2
* 0.3.0 simplified path changes, production HTML file now generated on compile
* 0.2.1 updated to [grunt-cleanempty](https://github.com/stevenvachon/grunt-cleanempty) v0.2
* 0.2.0 included [grunt-cleanempty](https://github.com/stevenvachon/grunt-cleanempty) v0.1
* 0.1.0 initial "feedback" release

---

[![Analytics](https://ga-beacon.appspot.com/UA-3614308-4/stevenvachon/can-boilerplate)](https://github.com/igrigorik/ga-beacon "Google Analytics") [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/stevenvachon/can-boilerplate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

# can-boilerplate

> Get a head start on your [CanJS](http://canjs.com/) v2.x project.

_How it can help you:_
* Get started quickly with Development and Production environment "shell" files
* Avoid feeling overwhelmed with a folder structure that's simple and light
* Save time with compilers and optimizers that do not require the use of a command line


## Getting Started

This plugin requires [NodeJS](http://nodejs.org/) `~0.8` and **currently only works on a Mac**.

### It currently comes packed with:
* [CanJS](http://canjs.com/) + [can-compile](https://github.com/daffl/can-compile)
* [jQuery](http://jquery.com/)
* [LESS](http://lesscss.org/) + [3L](http://mateuszkocz.github.io/3l/)
* [RequireJS](http://requirejs.org/) + [Almond](https://github.com/jrburke/almond)
* js/css compiler+minifier and a gif/png/jpg/svg optimizer
* Apache .htaccess files that enable `can.route.pushstate` use on all relative 404 routes
* [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/) (no need to install them globally)

### Roadmap Features:
* `0.6` add support for [DocumentJS](https://github.com/bitovi/documentjs)
* `0.7` add support for [Mocha](http://visionmedia.github.io/mocha/) and [FuncUnit](http://funcunit.com/)
* `0.8` turn this into an npm package (no longer Mac-only) with a scaffolder
* `0.9` ?

## Folder Structure
````
├── repo/
│   ├── client-dev/
│   │   ├── assets/
│   │   │   ├── backgrounds/
│   │   │   ├── backgrounds-embedded/
│   │   │   ├── chrome/
│   │   │   ├── chrome-embedded/
│   │   │   ├── fonts/
│   │   │   ├── icons/
│   │   │   ├── icons-embedded/
│   │   │   ├── textures/
│   │   │   └── textures-embedded/
│   │   ├── components/
│   │   │   └── app/
│   │   │       ├── helpers/
│   │   │       │   └── urls.js
│   │   │       ├── app.js
│   │   │       ├── app.less
│   │   │       └── app.mustache
│   │   ├── .htaccess
│   │   ├── .htaccess.production
│   │   ├── index.html
│   │   ├── index.production.html
│   │   ├── init.js
│   │   └── init.less
│   ├── client-dist/
│   ├── server/
│   ├── bower.json
│   ├── package.json
│   └── README.md
├── vendors/
│   ├── bower_components/
│   │   └── …
│   ├── gruntfiles/
│   │   └── …
│   └── node_modules/
│       └── …
└── can-boilerplate.command
````
`repo/client-dev/assets/*/`: media referenced from your JS and/or CSS. Folder included in production build.

`repo/client-dev/assets/*-embedded/`: media compiled into production CSS file (using LESS' `data-uri()`). Folder _excluded_ in production build.

_Any_ empty folder will be excluded from the production build.

_Any_ empty files in `repo/client-dev/assets/` will be excluded from the production build.


## FAQ
1. **Why not just set the \<script> and \<link> references to relative?**  
You could, but then the 404 routes to your index file would stop working.

2. **Why route 404s to the index file?**  
Because `can.route.pushstate` can figure out where it is in relation to its `root`. CanJS can handle most of your application from within the browser alone.

3. **Why gzip the *.js and *.css files upon compiling?**  
You don't have to rely on your webserver to do it for you. Read up on [serving pre-compressed files](http://blog.alien109.com/2009/03/17/gzip-your-javascript/).

4. **How can I get the *.command files to open?**  
You just need to [set ownership of the file to yourself](https://discussions.apple.com/message/16030281#16030281).

5. **What changes must I make when moving my production environment?**  
  * Run the compiler and change the app root value.
  * Move files from `repo/client-dist/` to their destination.

6. **What changes must I make when moving my development environment?**  
  * In `repo/client-dev/index.html`, update the `<data>` tag.
  * In `repo/client-dev/.htaccess`, update the path to `index.html`.


## Release History
* 0.5.0 added Bower, new folder structure, merged tools
* 0.4.5 tools cleanup, added support for JavaScript and LESS source maps (buggy)
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

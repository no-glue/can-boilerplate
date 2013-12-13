# can-boilerplate

> Get a head start on your [CanJS v2.x](https://github.com/bitovi/canjs/) project.

_How it can help you:_
* Get started quickly with Development and Production environment "shell" files
* Avoid feeling overwhelmed with a folder structure that's simple and light
* Save time with compilers and optimizers that do not require the use of a command prompt


## Getting Started

This plugin requires [NodeJS](http://nodejs.org/) `~0.8` and **currently only works on a Mac**.

This is the initial release, with an intent on listening to your feedback.

### I have plans to:
* create a scaffolder
* add support for Windows and \*nix
* avoid having to _install_ NodeJS, as I have done with Grunt

### It currently comes packed with:
* [CanJS](http://canjs.com/) + [can-compile](https://github.com/daffl/can-compile)
* [jQuery](http://jquery.com/)
* [LESS](http://lesscss.org/) + [3L](http://mateuszkocz.github.io/3l/)
* [RequireJS](http://requirejs.org/) + [Almond](https://github.com/jrburke/almond)
* js/css minifiers and gif/png/jpg/svg optimizers
* Apache .htaccess files that enable `can.route.pushstate` use on all relative 404 routes

...and:
* [Grunt](http://gruntjs.com/) (no need to install it)


## Folder Structure
`assets/css/`: LESS/CSS libraries compiled into production CSS file (eg. "/bin/app.css"). Folder _excluded_ in production build.

`assets/js/`: JS libraries compiled into production JS file (eg. "/bin/app.js"). Folder _excluded_ in production build.

`assets/media/*/`: media referenced from your JS and/or CSS. Folder included in production build.

`assets/media/*-embedded/`: media compiled into production CSS file (using LESS' `data-uri()`). Folder _excluded_ in production build.


## FAQ
#### How do I disable the automatic backup when using "minify-media"?
Open up `tools/gruntfiles/minify-media.js` and set `makeBackup` to `false`.

#### Why not just set the \<script> and \<link> references to relative?
You could, but then the 404 routes to your index file will stop working.

#### Why route 404s to the index file?
Because `can.route.pushstate` can figure out where it is in relation to its `root`. CanJS can handle most of your application from within the browser alone.

#### Why gzip the *.js and *.css files upon compiling?
You don't have to rely on your webserver to do it for you. Read up on [serving pre-compressed files](http://blog.alien109.com/2009/03/17/gzip-your-javascript/).

#### How can I get the *.command files to open?
You just need to [set ownership of the file to yourself](https://discussions.apple.com/message/16030281#16030281).

#### What changes must I make when moving my production build?
* In `src/index.production.html`, update the `<data>`, `<link>` and `<script>` tags
* Run the compiler in `tools/`
* Move files from `bin/` to their destination

#### What changes must I make when moving my entire project folder?
* In `src/index.html`, update the `<data>`, `<link>` and `<script>` tags
* In `src/index.production.html`, update the `<data>`, `<link>` and `<script>` tags


## Release History
0.2.0 included [can-cleanempty](https://github.com/stevenvachon/can-cleanempty)
0.1.0 initial "feedback" release

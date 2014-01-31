var npm = require("path").resolve(__dirname+"/..");

// Hack
require("grunt").cli(
{
	custom_cwd: process.cwd(),	// hack
	
	base: npm,
	gruntfile: npm+"/lib/gruntfiles"
});
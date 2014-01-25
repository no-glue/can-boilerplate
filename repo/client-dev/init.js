require.config(
{
	paths:
	{
		// Main Libraries
		can:	"../../vendors/bower_components/canjs/amd/can",
		jquery:	"../../vendors/bower_components/jquery/jquery"
	},
	shim:
	{
		// Non-AMD scripts
		//"../../vendors/bower_components/jquery.plugin":		["jquery"],
	}
});



require(
[
	"can",
	//"can/construct/proxy",
	"can/route/pushstate",
	
	// non-amd scripts here
	
	"templates",	// must be above any components/controls
	
	"components/app/app"
],
function()
{
	clearTimeout(preloader);
	preloader = null;
	
	can.route.bindings.pushstate.root = $("#appRoot").attr("value");
	
	$(".preloader").replaceWith( can.view.mustache("<app-container/>")() );
});

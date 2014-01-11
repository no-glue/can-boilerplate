require.config(
{
	paths:
	{
		// Main Libraries
		can:	"assets/js/amd/can",
		jquery:	"assets/js/amd/jquery-2.0.3"
	},
	shim:
	{
		// Non-AMD scripts
		//"assets/js/jquery.plugin":		["jquery"],
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

require.config(
{
	paths:
	{
		// Main Libraries
		can:	"assets/js/canjs-2.0.3/amd/can",
		jquery:	"assets/js/jquery-2.0.3"
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
	
	"templates",	// must be above any components
	
	"components/app/app"
],
function()
{
	clearTimeout(preloader);
	preloader = null;
	
	
	can.route.bindings.pushstate.root = $("#appRoot").attr("value");
	
	
	// {{app-route}} available to all templates
	/*can.Mustache.registerHelper("app-route", function()
	{
		var url = can.route.bindings.pushstate.root;
		
		for (var i=0, numArguments=arguments.length-1; i<numArguments; i++)	// avoid last index (the scope)
		{
			url += arguments[i] + "/";
		}
		
		return url;
	});*/
	
	
	$(".preloader").replaceWith( can.view.mustache("<app-container/>") );
});

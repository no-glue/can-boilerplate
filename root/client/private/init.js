require.config(
{<% if (library.name.indexOf("jquery") < 0) { %>
	map:
	{
		"*":
		{
			// Override CanJS' default dependency on jQuery
			"can/util/library" : "can/util/<%= library.name %>"
		}
	},<% } %>
	paths:
	{
		// Main Libraries
		"can":		"vendors/canjs/amd/can",
		"<%= library.name %>":	"<%= library.path.substr(0, library.path.lastIndexOf(".js")) %>"
	},
	shim:
	{
		// Non-AMD scripts
		//"vendors/<%= library.name %>.plugin":		["<%= library.name %>"],
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

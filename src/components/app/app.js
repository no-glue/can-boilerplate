define(
[
	"can",
	
	// Anything else
	//"components/something/something",
],
function()
{
	// {{app-route-section 'sectionname'}} available to all templates
	/*can.Mustache.registerHelper("app-route-section", function(section)
	{
		return can.route.url({ section:section });
	});*/
	
	
	
	return can.Component.extend(
	{
		tag: "app-container",
		template: can.view("components/app/app"),
		
		
		
		init: function(element, options)
		{
			/*can.route("", {section:""});
			can.route(":section/");
			can.route(":section/:sub/");
			can.route.ready();*/
		},
		
		
		
		scope:
		{
			
		},
		
		
		
		events:
		{
			/*"{can.route} section": function(route, event, newVal)
			{
				console.log("section :: "+newVal);
			}*/
		}
	});
});
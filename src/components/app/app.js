define(
[
	"can",
	
	// Anything else
	//"components/something/something",
],
function()
{
	return can.Component.extend(
	{
		tag: "app-container",
		template: can.view("components/app/app"),
		
		
		
		init: function(element, options)
		{
			//can.route(":something/");
			//can.route.ready();
		},
		
		
		
		scope:
		{
			
		},
		
		
		
		events:
		{
			":section route": function(data)
			{
				console.log(":section route");
			},
			
			
			
			"route": function(data)
			{
				console.log("route");
			}
		}
	});
});
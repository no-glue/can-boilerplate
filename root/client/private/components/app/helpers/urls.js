define(["can"], function()
{
	// When no helper parameters are specified, the first argument
	// is set to contain the options object
	function overrideOptions(str)
	{
		if (typeof str !== "string") return "";
		
		return str;
	}
	
	
	
	// These are available in all templates
	
	
	
	// {{app-route-section 'sectionname'}}
	can.Mustache.registerHelper("app-route-section", function(section)
	{
		section = overrideOptions(section);
		
		return can.route.url({ section:section });
	});
	
	
	
	// {{app-root-url}} and {{app-root-url 'url/'}}
	can.Mustache.registerHelper("app-root-url", function(path)
	{
		path = overrideOptions(path);
		
		// Remove leading slash
		if (path.indexOf("/") == 0)
		{
			path = path.substr(1);
		}
		
		return can.route.bindings.pushstate.root + path;
	});
	
	
	
	// {{current-url}} and {{current-url 'url/'}}
	can.Mustache.registerHelper("current-url", function(path)
	{
		path = overrideOptions(path);
		
		// Remove leading slash
		if (path.indexOf("/") == 0)
		{
			path = path.substr(1);
		}
		
		return window.location.pathname + path;
	});
	
	
	
	// {{domain-root-url}} and {{domain-root-url '/rooturl/'}}
	can.Mustache.registerHelper("domain-root-url", function(path)
	{
		path = overrideOptions(path);
		
		// Add leading slash
		if (path.indexOf("/") != 0)
		{
			path = "/"+path;
		}
		
		return path;
	});
	
	
	
	return can;
});
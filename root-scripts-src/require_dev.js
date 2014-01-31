function require_dev(files, callback)
{
	var appRoot = document.querySelector("#appRoot").getAttribute("value");
	var count = -1;
	
	
	
	function require_file(url, file_callback)
	{
		var extension = url.match( /\.([0-9a-z]+)(?:[\?#]|$)/i );
		var tag;
		
		if (extension)
		{
			extension = extension[1];
		}
		else
		{
			console.error("Missing file extension: "+url);
			return false;
		}
		
		switch (extension)
		{
			case "css":
			case "less":
			{
				tag = document.createElement("link");
				tag.setAttribute("rel", "stylesheet/"+extension);
				tag.setAttribute("href", url);
				
				var img = document.createElement("img");
				img.onerror = function()
				{
					file_callback.apply(tag);
					delete this.onerror;
				}
				img.src = url;
				
				break;
			}
			case "js":
			{
				tag = document.createElement("script");
				tag.setAttribute("src", url);
				tag.onload = function()
				{
					file_callback.apply(this);
					delete this.onload;
				}
				break;
			}
			default:
			{
				console.error('Unsupported file extension "'+extension+'": '+url);
				return false;
			}
		}
		
		document.body.appendChild(tag);
		
		return tag;
	}
	
	
	
	function require_next()
	{
		if (++count < files.length)
		{
			require_file(appRoot+files[count], function()
			{
				require_next();
			});
		}
		else
		{
			if (callback) callback();
		}
	}
	
	
	
	require_next();
}
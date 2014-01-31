var child_process = require("child_process");



module.exports = function(app, command, cwd, callback)
{
	var child = child_process.spawn(app, [command], {cwd:cwd, stdio:"inherit"});
	
	child.on("exit", function(code)
	{
		this.removeAllListeners();
		
		callback();
	});
}

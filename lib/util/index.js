module.exports = function(grunt)
{
	return {
		answersInfo:       require("./answersInfo")(grunt),
		bowerDependencies: require("./bowerDependencies")(grunt),
		prompt:            require("./prompt")(grunt)
	};
}

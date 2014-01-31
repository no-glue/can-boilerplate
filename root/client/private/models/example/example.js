define(
[
	"can",
	
	// Anything else
],
function()
{
	return can.Model.extend(
	{
		findAll: "GET /todos.json",
		findOne: "GET /todos/{id}.json",
		create:  "POST /todos.json",
		update:  "PUT /todos/{id}.json",
		destroy: "DELETE /todos/{id}.json" 
	},
	{
		
	});
});
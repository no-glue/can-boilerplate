describe("Functional tests", function()
{
	before(function(done){ F.open("/",done) });
	after(function(){ F.win.close() });
	
	
	
	it("should find app entry point", function(done)
	{
		F("app-container").exists(function(){ done() });
	});

});
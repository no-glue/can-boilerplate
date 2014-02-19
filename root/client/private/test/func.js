describe("Functional tests", function()
{
	/*beforeEach( function()
	{
		this.wombat = new Wombat();
	});
	
	
	
	afterEach( function()
	{
		delete this.wombat;
	});*/
	
	
	
	it("should find mocha test area", function(done)
	{
		expect( F("#mocha").attr("id") ).to.equal("mocha");
		
		done();
	});
	
	
	
	/*describe("#eat", function()
	{
		it("should throw if no food passed", function()
		{
			this.wombat = new Wombat({ name: "Matt" });
			expect(this.wombat).property("name", "Matt");
		});
	});*/

});
function DefaultConfig(grunt)
{
	this.grunt = grunt;
}



/*
	Sets up grunt.config("cfg")
	Returns a readable list
*/
DefaultConfig.prototype.get = function(questions)
{
	questions = this.grunt.config(questions);
	
	var string = "";
	
	for (var i=0, numQuestions=questions.length; i<numQuestions; i++)
	{
		var question = questions[i];
		
		if (question.displayAsDefault !== false)
		{
			var defaultAnswer = question.default;
			var stringAnswer;
			
			switch (question.type)
			{
				case "checkbox":
				{
					if (defaultAnswer == undefined)
					{
						defaultAnswer = [];
						
						for (var j=0, numChoices=question.choices.length; j<numChoices; j++)
						{
							var choice = question.choices[j];
							
							if (choice.checked) defaultAnswer.push(choice);
						}
					}
					
					stringAnswer = defaultAnswer.map( function(element)
					{
						return element.name;
					}).join(", ");
					
					defaultAnswer = defaultAnswer.map( function(element)
					{
						return (element.value != undefined) ? element.value : element.name;
					});
					
					if (stringAnswer == "") stringAnswer = "none";
					
					break;
				}
				case "list":
				{
					defaultAnswer = question.choices[ defaultAnswer || 0 ];
					
					stringAnswer = defaultAnswer.name;
					
					defaultAnswer = (defaultAnswer.value != undefined) ? defaultAnswer.value : defaultAnswer.name;
					
					break;
				}
			}
			
			this.grunt.config(question.config, defaultAnswer);
			
			string += question.message+": "+stringAnswer.cyan;
			
			if (i < numQuestions-1) string += "\n";
		}
	}
	
	return string;
}



module.exports = DefaultConfig;

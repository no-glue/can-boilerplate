function AnswersInfo(grunt)
{
	this.grunt = grunt;
}



/*
	Loop through every answer, excluding individual multiple choice selections.
*/
AnswersInfo.prototype.eachAnswer = function(obj, callback)
{
	for (var i in obj)
	{
		if (typeof obj[i] == "object")
		{
			obj[i] = callback.call( this, obj[i], i, obj );
		}
	}
	
	return obj;
}



/*
	Loop through every answer, including individual multiple choice selections.
*/
AnswersInfo.prototype.eachEveryAnswer = function(obj, callback)
{
	var each = function(answer)
	{
		if ( Array.isArray(answer) )
		{
			answer.forEach( function(choice, i)
			{
				answer[i] = callback.call(this, choice);
				
			}, this);
			
			return answer;
		}
		else if ( answer.hasOwnProperty("name") )
		{
			// No need to go deeper
			return callback.call(this, answer);
		}
		else
		{
			// Go deeper
			return this.eachAnswer(answer, each);
		}
	};
	
	return this.eachAnswer(obj, each);
}



/*
	Set expected structure for multiple choice answers.
	Return a flat array of dependencies.
	
	Also removes empty values set with "-".
	Had to use such because grunt-prompt had issues with `value:""`
*/
AnswersInfo.prototype.getDepsList = function(cfg)
{
	var deps = [];
	
	var each = function(answer, i)
	{
		if ( Array.isArray(answer) )
		{
			// Clean up structure for later
			answer.forEach( function(choice, j)
			{
				if (/*typeof choice == "number" ||*/ typeof choice == "string")
				{
					if (choice == "-")
					{
						choice = "";
					}
					else
					{
						deps.push(choice);
					}
					
					answer[j] = {name:choice, path:""};
				}
			}, this);
			
			return answer;
		}
		else if ( answer.hasOwnProperty("name") )
		{
			if (answer.name == "-")
			{
				answer.name = "";
			}
			else
			{
				deps.push(answer.name);
			}
			
			// No need to go deeper
			return answer;
		}
		else
		{
			// Go deeper
			return this.eachAnswer(answer, each);
		}
	};
	
	this.grunt.config(cfg, this.eachAnswer( this.grunt.config(cfg), each ) );
	
	return deps;
}



/*
	Find default answers.
	Populate config with default answers (in case they are skipped over).
	Return a readable list.
*/
AnswersInfo.prototype.getDefaults = function(questions)
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



module.exports = AnswersInfo;

module.exports = function(grunt)
{
	/*
		Loop through every answer, excluding individual multiple choice selections.
	*/
	function eachAnswer(obj, callback)
	{
		for (var i in obj)
		{
			if (typeof obj[i] == "object")
			{
				obj[i] = callback( obj[i], i, obj );
			}
		}
		
		return obj;
	}
	
	
	
	/*
		Loop through every answer, including individual multiple choice selections.
	*/
	function eachEveryAnswer(obj, callback)
	{
		var each = function(answer)
		{
			if ( Array.isArray(answer) )
			{
				answer.forEach( function(choice, i)
				{
					answer[i] = callback(choice);
					
				});
				
				return answer;
			}
			else if ( answer.hasOwnProperty("name") )
			{
				// No need to go deeper
				return callback(answer);
			}
			else
			{
				// Go deeper
				return eachAnswer(answer, each);
			}
		};
		
		return eachAnswer(obj, each);
	}
	
	
	
	/*
		Set expected structure for multiple choice answers.
		Return a flat array of dependencies.
		
		Also removes empty values set with "-".
		Had to use such because grunt-prompt had issues with `value:""`
	*/
	function getDepsList(cfg)
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
				return eachAnswer(answer, each);
			}
		};
		
		grunt.config(cfg, eachAnswer( grunt.config(cfg), each ) );
		
		return deps;
	}
	
	
	
	/*
		Find default answers.
		Populate config with default answers (in case they are skipped over).
		Return a readable list.
	*/
	function getDefaults(questions)
	{
		questions = grunt.config(questions);
		
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
				
				grunt.config(question.config, defaultAnswer);
				
				string += question.message+": "+stringAnswer.cyan;
				
				if (i < numQuestions-1) string += "\n";
			}
		}
		
		return string;
	}
	
	
	
	return {
		eachAnswer: eachAnswer,
		eachEveryAnswer: eachEveryAnswer,
		getDepsList: getDepsList,
		getDefaults: getDefaults
	};
}

require('dotenv').config();
const prompt = require('prompt');
const https = require('https');
const colors = require('colors/safe');

var questionCount = 0;
var score = 0;

let showAnswers = false;
let question_pool;

let options = {
	host: process.env.SPREADSHEET_HOST,
	path: process.env.SPREADSHEET_URL,
	method: 'GET'
};

process.argv.forEach((val, index) => {
  if(index === 2) {
  	showAnswers = val;
  }
});

var hreq = https.request(options, function(res){
	var body = '';
	res.on('data', function(chunk){
		body += chunk;
	});

	res.on('end', function(){
		question_pool = utilArrayShuffle(JSON.parse(body));
		getQuestion();
	});

});

hreq.end();

function getQuestion() {
	if(questionCount < question_pool.length) {
		var acronym = question_pool[questionCount].tla;		

		prompt.get([acronym], function(err, result){
			if(err) {
				return;
			}

			var input = result[acronym];
			var answer = question_pool[questionCount].expanded;

			if(input.toLowerCase() === answer.toLowerCase()) {
				prompt.message = colors.green('CORRECT' + '\n');
				++score;
			} else {
				if(showAnswers) prompt.message = colors.red('INCORRECT ' + answer + '\n');
				else prompt.message = colors.red('INCORRECT\n');
			}

			++questionCount;
			prompt.message += 'Your score is ' + score + '/' + questionCount + '\n';
			getQuestion();
		});
	}
}

function utilArrayShuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
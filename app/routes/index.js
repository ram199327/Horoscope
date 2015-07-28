var express = require('express');
var router = express.Router();
var promise = require('promise');
var pmongo = require('promised-mongo');
var db = pmongo('mongodb://localhost:27017/josiyam', ['predictions']);
var predictions = db.collection('predictions');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sivagami Computer Josiyam' });
});

router.get('/predictions', function(req, res) {
  predictions.find({}).toArray()
  .then(function(result){
  	var horos_no_of_user = getNumber(req.query.dob);
  	var index = horos_no_of_user % result.length;
  	res.json(result[index - 1]);
  })
});

//Get number based on DOB
function getNumber(dob){
	var sum=0;
	for(var i=0;i<dob.length;i++){
		var num = dob.charAt(i)
		if(parseInt(num)){
			sum += parseInt(num);
		}
	}
	return sumDigits(sum);
}

//Sum of the digits
function sumDigits(number) {
  var str = number.toString();
  var sum = 0;
  for (var i = 0; i < str.length; i++) {
    sum += parseInt(str.charAt(i));
  }
  return sum;
}

module.exports = router;
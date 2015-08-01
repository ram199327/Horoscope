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
  var dob = req.query.dob;
  var gender = req.query.gender;
  var sign = getSign(dob);
  var category = getCategory(dob,gender);
  predictions.find({$and:[{sign:sign},{$or:[{category : category},{placement : 'intro'}]}]}).toArray()
  .then(function(result){
    var placement_intro={},placement_category={},placement_prediction={};
    result.forEach(function(val,index){
      if(val['placement'] == 'intro'){
        placement_intro[val.value_id] = val;
      }
      else if(val['placement'] == 'predictions'){
        placement_prediction[val.value_id] = val;
      }
      else if(val['placement'] == 'category'){
        placement_category[val.value_id] = val;
      }
    });
    var final_result = [];
    var horos_no = getNumber(dob);    
    final_result.push(filteredResult(placement_intro,horos_no));
    final_result.push(filteredResult(placement_category,horos_no));
    final_result.push(filteredResult(placement_prediction,horos_no));
    res.json(final_result);
  })
});

function filteredResult(obj,horos_no){
  var obj_len = Object.keys(obj).length;
  var key = horos_no % obj_len;
  return obj[key ? key : (obj_len - key)];
}

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

function getSign(dob){
  var arr = dob.split('-');
  var date = parseInt(arr[0]);
  var month = parseInt(arr[1]);
  if(date >= 21 && month == 3 || date <= 19 && month == 4)
    return 'aries';
  else if(date >= 20 && month == 4 || date <= 20 && month == 5)
    return 'taurus';
  else if( date >= 21 && month == 5 || date <= 20 && month == 6)
    return 'gemini';
  else if( date >= 21 && month == 6 || date <= 22 && month == 7)
    return 'cancer';
  else if( date >= 23 && month == 7 || date <= 22 && month == 8)
    return 'leo';
  else if( date >= 23 && month == 8 || date <= 22 && month == 9)
    return 'virgo';
  else if( date >= 23 && month == 9 || date <= 22 && month == 10)
    return 'libra';
  else if( date >= 23 && month == 10 || date <= 21 && month == 11)
    return 'scorpio';
  else if( date >= 22 && month == 11 || date <= 21 && month == 12)
    return 'sagittarius';
  else if( date >= 22 && month == 12 || date <= 19 && month == 1)
    return 'capricorn';
  else if( (date >= 20 && month == 1) || (date <= 18 && month == 2))
    return 'aquarius';
  else if( date >= 19 && month == 2 || date <= 20 && month == 3)
    return 'pisces';
}

function getAge(dob){
  var arr = dob.split('-');
  var current_date = new Date();
  var actual_dob = new Date(arr[2],arr[1],arr[0]);
  var diffTime = current_date.getTime() - actual_dob.getTime();
  var age = diffTime/(1000*3600*24*365.25)
  return Math.floor(age);
}

function getCategory(dob,gender){
  var age = getAge(dob);
  if(age < 20)
    return 'children';
  else if ((age < 25 || (age > 30 && age <= 35)) && gender == 'M')
    return 'career';
  else if ((age > 25 && age <= 30) && gender == 'M')
    return 'romance';
  else if (age <= 24 && gender == 'F')
    return 'career';
  else if (age <= 32 && gender == 'F')
    return 'romance';
  else
    return 'finance_parenthood';
}

module.exports = router;
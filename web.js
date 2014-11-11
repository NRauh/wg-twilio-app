// TWILIO AUTH
// Create a file called `.env`
// Add the following lines to that file:
// TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
// TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
//
// Replace with your Twilio account SID and auth token
var client = require('twilio')( process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN );

var express = require('express');
var app = express();
var restler = require('restler');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser());


var facts = ["Cats don't like sugar gliders", "Eagles eat Panthers on Monday night football", "Cat doesn't like you", "Cat does like you", "Give Cat toy", "Babies like Cat", "Don't put Cat in corner"];


app.post("/phoneafact", function(req, res) {
  var tmpMessage;
  
  tmpMessage = facts[Math.floor(Math.random() + facts.length()];

  var message = '<Response><Say voice="alice" language="de-DE">Achtung! Achtung! Here ist un cat fact!' + tmpMessage + '. Gutenacht!</Say></Response>';

  res.send(message);
});

app.post("/givemeafact", function(req, res) {
  var tmpMessage;

  if (req.body.Body === "Fact!") {
    tmpMessage = facts[Math.floor(Math.random() * facts.length)];
  } else {
    tmpMessage = "No Fact for you!";
  }

  var message = "<Response><Sms>"+tmpMessage+"</Sms></Response>";
  res.send(message);
});



// When the form is submitted, send the message to the person listed
app.post('/', function(request, response) {
    var number = request.body.number;
    var results = sendTextToFriend(number, response);
});

/**
 * Send a text message to the chosen friend
 * @param  {string} number  Number of friend
 * @return {void}
 */
var sendTextToFriend = function(number, response) {
    client.sendMessage({
        to: number,
        from: '+16024834889',
        body: "You've subscribed to cat facts"
    }, function(err, responseData) {
        if (!err) {
            console.log(responseData.from);
            console.log(responseData.body);

            response.send('Message sent.')
        } else {
            console.log(err);

            return false;
            response.send('An error occurred.');
        }
    });
};

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
})

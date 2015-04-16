var express = require('express'),
    app = express(),
    Client = require('badgekit-api-client');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var apiEndpoint = process.env.BADGES_ENDPOINT || 'http://localhost:8080';
var auth = {
  key: process.env.BADGES_KEY || 'http://localhost:8080',
  secret: process.env.BADGES_SECRET || 'http://localhost:8080'
};

var client = new Client(apiEndpoint, auth);


app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

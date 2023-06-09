var express = require('express');
var app = express();

app.use(express.static('src'));
app.use(express.static('src/build/contracts'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3000, function () {
  console.log('IPL Auction Dapp listening on port 3000!');
});
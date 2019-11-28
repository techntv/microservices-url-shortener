// server.js
// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

let shortcutList = {}
// enable CORS (htps://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 }));  // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: false }))
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  const url = req.body.url
  dns.lookup(url, (err) => {
    if (err) {
      res.json({ "error": "invalid URL" })
    }
  })
  let numberURL;
  do {
    numberURL = Math.floor(Math.random() * (999) + 1);
    shortcutList[numberURL] = url
  } while (!(numberURL in shortcutList))


  res.json({
    original_url: url,
    short_url: numberURL
  })
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  if (shortcutList[id]) {
    res.writeHead(302, { Location: shortcutList[id] })
    res.end()
  }
})

app.listen(4000, function () {
  console.log('Your app is listening on port ' + 4000);
});
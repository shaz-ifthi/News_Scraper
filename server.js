// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

// Mongoose Database configuration 
mongoose.connect("mongodb://localhost/news-scraper");
var db = mongoose.connection;

// Show mongoose errors
db.on("error", function(error) {
  console.log(error);
});

//Log successful connection when logged into the DB through mongoose
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
var j;
// GET request to scrape the nyTimes website
app.get("/scrape", function(req, res) {
  console.log("Begin Scrape")
  // grab the body of the html with request
  request("https://www.nytimes.com/", function(error, res, html) {
    console.log("Request Scrape")

    //Load that into cheerio and save 
    var $ = cheerio.load(html);
    j = 1;
    $("article h1").each(function(i, element) {
      console.log("article number" + j)
      j = j + 1;
      //empty result object
      var result = {};

      // Add the text and href
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var entry = new Article(result)
      console.log(entry);
      // save to the DB
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
  });
  res.send("Scrape Complete!" );
});

//Get the articles scraped from the mongoDB
app.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's Id
app.get("/articles/:id", function(req, res) {
  Article.findOne({ "id": req.params.id })
  // add all the notes associated with it
  .populate("note")
  .exec(function(error, doc) {
    
    if (error) {
      console.log(error);
    }
     else {
      res.json(doc);
    }
  });
});

// Listen on port 3000
app.listen(process.env.PORT || 3000, function(error) {
  if (error) throw error
   console.log("LISTENING ON PORT 3000!");
});
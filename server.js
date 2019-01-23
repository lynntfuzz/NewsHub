var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.medicalnewstoday.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var counter = 0;
    // Now, we grab every h2 within an article tag, and do the following:
    $(".featured").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this).children("a").attr("title");
      result.link = "https://www.medicalnewstoday.com" + $(this).children("a").attr("href");
      result.imagelink = $(this).children("a").children("img").attr("data-src");
      
      
  //      This is hacky. The summary is in a html string that looks like this:
  //
  //          <strong>ALS: A new therapy may be in sight</strong> 
  //          <em>New research, led by Harvard scientists, identifies a novel
  //           potential therapeutic target for treating amyotrophic lateral sclerosis (ALS). </em>
  //
  //      I couldn't figure out how to parse out the <em> text using cheerio so I just 
  //      parsed it out programmatically using string methods so that I could go on with my life.    

      var tempString = $(this).children("a").children("span.headline").html();
      var start = tempString.indexOf("<em>");
      var end = tempString.indexOf("</em>")
   
      // sometimes there is no summary text, just leave it undefined if no summary text available.
      if (start != -1) {
        result.summary = tempString.slice(start + 4,end);
      }
      db.Article.findOne({ link: result.link})
        .then(function (dbArticle) {
          if (dbArticle) {
            console.log("DUPLICATE!!! " + dbArticle.headline);
          } else {
            console.log("NEW ARTICLE " + db.Article.headline);
            //Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
          }
        });
      
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's Comments
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("comments")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log(err)
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated comments
app.post("/articles/:id", function(req, res) {
  
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id },{ $push: { comments: [dbComment._id] } }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/comment/:id", function(req, res) {
  
  // Create a new comment and pass the req.body to the entry
  db.Comment.deleteOne(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id },{ $pop: { comments: [dbComment._id] } }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

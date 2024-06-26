const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikidb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  console.log("MongoDB Connected with server")
);

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// Routes for /articles
app.route("/articles")
  .get(async (req, res) => {
    try {
      const foundArticles = await Article.find();
      res.send(foundArticles);
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        console.error(err);
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}).then(function() {
      res.send("Successfully deleted all articles.");
    }).catch(err => {
      console.error(err);
      res.send(err);
    });
  });

// Routes for /articles/:articleTitle
app.route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const result = await Article.findOne({ title: req.params.articleTitle });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  })
  .put(function(req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content } }
    )
    .then(function() {
      res.send("Successfully updated article.");
    })
    .catch(function(err) {
      console.error(err);
      res.send(err);
    });
  })
  .patch(function(req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body }
    )
    .then(function() {
      res.send("Successfully updated article.");
    })
    .catch(function(err) {
      console.error(err);
      res.send(err);
    });
  })
  .delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle })
      .then((article) => {
        if (article) {
          res.send("Article deleted successfully.");
        } else {
          res.send("Failed deleting the Article.");
        }
      });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

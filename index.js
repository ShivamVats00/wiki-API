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



app.route("/articles").get(async (req, res) => {
  try {
    const foundArticles = await Article.find();
    // console.log(foundArticles);
    res.send(foundArticles);
  } catch (err) {
    // console.log(err);
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
      res.send("Successfully added a new article.")
    } else {
      res.send(err)
    }
  });
})

.delete(function(req, res) {

  Article.deleteMany({}).then(function() {

    res.send("successfully deleted all articles");

  }).catch(err => {

    res.send(err);

  });

});

////request targeting a specific Article////////



app.route("/articles/:articleTitle")

.get(async (req, res) => {
try {
  const result = await Article.findOne({ title: req.params.articleTitle });
  res.send(result);
} catch (error) {
  res.send(error);
}
})

.put(function (req, res) {
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true})
    .then(function () {
      res.send("Succesfully updated article");
      })
      .catch(function (err) {
        res.send(err);
        })
})

.patch(function (req, res) {
      Article.updateOne(
      {title: req.params.articleTitle},
        {$set: req.body})
        .then(function () {
          res.send("Succesfully updated article");
          })
          .catch(function (err) {
            res.send(err);
            })
  })

.delete(function (req, res) {
    Article.deleteOne(
      { title: req.params.articleTitle },
      { $set: req.body }
    ).then((article) => {
      if (article) {
        res.send("Article deleted successfully");
      } else {
        res.send("Failed deleting the Article");
      }
    });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

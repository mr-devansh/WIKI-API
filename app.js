const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);


///////////////////////////////////////requests targetting all articles

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }});
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("SAVED!");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("DELETED EVERYTHING!");
    }
    else{
      res.send(err);
    }
  })
});

///////////////////////////////////requests targetting specific article
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if (foundArticle){
        res.send(foundArticle);
      }
      else{
        res.send(err);
        console.log(err);
      }
    });
})
.put(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title,content: req.body.content},
    function(err, result){
      if(!err){
        res.send("UPDATED!");
      }
      else{
        res.send(err);
      }
  });
})
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title,content: req.body.content},
    {$set: req.body},
  function(err){
    if(!err){
      res.send("UPDATED!");
    }
    else{
      res.send(err);
    }
  }
);
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.body.title},
    function(err){
      if(!err){
        res.send("DELETED THE PARTICULAR DOCUMENT!");
      }
      else{
        res.send(err);
      }
    }
  )
});

app.listen(3000, function(){
  console.log("up at 3000");
})

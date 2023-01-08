const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

// mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

mongoose.connect(process.env.MONGO_PASS).
    catch(error => handleError(error));

const postSchema = {
  title: 'String',
  content:'String'
}

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "This is a blog webiste where I'll add my daily learning as a blog post";
const aboutContent = "I am student who is currently learning web development course in udemy by Angela Yu";

const contactContent ="There is no way to contact me as of now.Cheers!";

const app = express();

// let posts = [];
var length = 100;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
  Post.find({},function(err,posts){
      res.render("home",{homeContent:homeStartingContent,posts:posts});
  })
});

app.get("/posts/:postId",function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId},function(err,post){
    res.render("post",{title:post.title,content:post.content});
  });  
});


app.get("/about",function(req,res){
  res.render("about",{aboutInfo:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactInfo:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});


app.post("/compose",function(req,res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  }); 
})

app.listen(3000, function() {
  console.log("Server started successfully");
});

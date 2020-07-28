var express = require("express");
var router = express.Router();
var Post = require("../model/Post");
var User = require("../model/User");
var multer = require("multer");
var upload = multer({ dest: "public/images/uploads" });

router.get("/add", function (req, res) {
  User.find(function (err, rtn) {
    if (err) throw err;
    res.render("post/add", { users: rtn });
  });
});

router.post("/add", upload.single("photo"), function (req, res) {
  var post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  if (req.file) post.imgUrl = "/images/uploads/" + req.file.filename;
  post.author = req.body.author;
  post.save(function (err, rtn) {
    if (err) throw err;
    res.redirect("/posts/list");
  });
});

router.get("/list", function (req, res) {
  Post.find({})
    .populate("author")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("post/list", { posts: rtn });
    });
});

router.get("/detail/:pid", function (req, res) {
  Post.findById(req.params.pid)
    .populate("author")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("post/detail", { post: rtn });
    });
});

router.get("/update/:id", function (req, res) {
  Post.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    User.find(function (err2, rtn2) {
      if (err2) throw err2;
      res.render("post/update", { post: rtn, users: rtn2 });
    });
  });
});

router.post("/update", function (req, res) {
  var update = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  };
  Post.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
    if (err) throw err;
    res.redirect("/posts/list");
  });
});

router.get("/delete/:id", function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.redirect("/posts/list");
  });
});
module.exports = router;

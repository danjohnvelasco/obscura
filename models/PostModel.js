const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema(
  {
    author: {type: Schema.Types.ObjectId, ref: 'users', required: [true, "no author id provided"]}, 
    img: {type: String, required: [true,"No img link provided"] },
    caption: {type: String, required: [true, "No caption provided"]},
    title: {type: String, required: [true, "No author provided"]},
    likes: {type: Number, default: 0, min: 0},
    comments: [{
        commenter: {type: Schema.Types.ObjectId, ref: 'users', required: [true, "no commenter id provided"]},
        comment: {type: String, required: [true, "No comment provided"]}
    }]
  }
);

const PostModel = mongoose.model('Post', PostSchema);

// Get all Posts
exports.getDiscoverPosts = function (next) {
  PostModel.find({}, 'img') // Add filter for not followed
    .exec((err, data) => {
      if (err) throw err;

      var posts = [];
      data.forEach((post) => {
        posts.push(post.toObject());
      });

      next(posts);
    });
};

//Get following posts
exports.getFollowingPosts = function (id, next) {
  PostModel.find( {author : id}, 'img') // Add filter for not followed
    .exec((err, data) => {
      if (err) throw err;

      var posts = [];
      data.forEach((post) => {
        posts.push(post.toObject());
      });

      next(posts);
    });
};

//Get current profile's posts
exports.getProfilePosts = function (id, next) {
  PostModel.find( {author : id}, 'img') // Add filter for not followed
    .exec((err, data) => {
      if (err) throw err;

      var posts = [];
      data.forEach((post) => {
        posts.push(post.toObject());
      });

      next(posts);
    });
};


exports.getPostById = function (id, next) {
  PostModel.findById(id)
    .populate('author')
    .populate({
      path: 'comments.commenter',
      model: 'users'
    })
    .exec((err, post) => {
      if (err) throw err;
      next(post.toObject());
    });
};

exports.createComment = function (id, commenter, comment, next) {
  PostModel.findOneAndUpdate(
    { _id: id }, // find post by ID
    { $push: { comments: {commenter: commenter, comment: comment} } }, // push to comments[]
    { 
      fields: { comments: { '$slice': -1 } }, // get last element of comments[]
      new: true // new: true returns the updated doc, must be defined last
    }).populate({ // populate to get commenter details
        path: 'comments.commenter',
        select: 'profilePic username', // REPLACE WITH FULL NAME VIRTUAL
        model: 'users'
      })
      .exec((err, success) => {
        if (err) throw err;
        var commentDetails = success.comments[0]; // select comment created by user (it's the only comment in the [])
        next(commentDetails);
      });
};

exports.createPost = function (postObj, next) {
  const post = new PostModel(postObj);

  post.save(function (err, post) {
    if (err) throw err;
    
    next(post);
  });
};

exports.deletePost = function (postID, next) {
  PostModel.deleteOne({_id: postID}, function(err) {
    if (err) throw err;
    next("Delete successful");
  })
}

exports.updateLikes = function (postId, hearts, next) {
  PostModel.findByIdAndUpdate(postId, {likes: hearts}, {new : true},  function(err, model) {
    if (err) throw err;
    next(err, model);
  })
}
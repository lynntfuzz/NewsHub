var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  author: String,
  title: String,
  body: String,
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;

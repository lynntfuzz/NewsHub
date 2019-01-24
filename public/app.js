// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page

    var div = $("<div/>");
    div.addClass("card");
    div.attr("id", "news-card");
    div.attr("data-id", data[i]._id);
    div.css("width", "18rem;");
   
    var img = $("<img/>");
    img.addClass("card-img-top");
    img.attr("src", data[i].imagelink);
    img.attr("href", data[i].imagelink);
    div.append(img);

    var card_body = $("<div/>");
    card_body.css("width", "18rem;");
    card_body.append("<h2 class=\"card-title\">" + data[i].headline + "</h2>");
    card_body.append("<p class=\"card-text\">" + data[i].summary + "</p>");
    card_body.append("<a href=" + data[i].link + ">Link to Article</a>");
    card_body.append("<button type=\"button\" class=\"btn btn-primary\" data-id=" + data[i]._id + ">Comment</input>");
    div.append(card_body);

    $("#articles").append(div);

  //$("#articles").append("<div class=\"front-card\"><p data-id='" + data[i]._id + "'> <strong>" + data[i].headline + "</strong><br /> " + data[i].summary + "<br />  <a href=" + data[i].link+ ">" + data[i].link + "</a></p></div>");
  }
});

// whenever someone clicks on a news-card
$(document).on("click", "#news-card", function() {
  console.log("Clicky Click");
  // Empty the Comments from the Comment section
  $("#Comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log("id = " + thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the Comment information to the page
    .then(function(data) {
      setCurrentArticle(data);
      
   
    });
});

// When you click the saveComment button
$(document).on("click", "#saveComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("article thisId= " + thisId);
  // Run a POST request to change the Comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from headline input
      headline: $("#headlineinput").val(),
      // Value taken from Comment textarea
      body: $("#bodyinput").val(),
      author: $("#authorinput").val(),
      article: thisId
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      // console.log("added comment data ---> " + data[0]);
      // loadComment(data);
      setCurrentArticle(data);
    });

  // Also, remove the values entered in the input and textarea for Comment entry
  $("#headlineinput").val("");
  $("#bodyinput").val("");
  $("#authorinput").val("");
});

// When you click the deleteComment button
$(document).on("click", "#deleteComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("comment to delete id= " + thisId);

  //Run a DELETE request to delete the Comment, using the id
  $.ajax({
    method: "DELETE",
    url: "/comment/" + thisId
   
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);

      // remove that comment or should I trigger a whole reload?????
      var hopefully_the_rightdiv = $("div[data-id= " + thisId + "]");
      console.log(hopefully_the_rightdiv);
      hopefully_the_rightdiv.remove();
      
    });


});

function setCurrentArticle(article) {
  
    console.log("Got Article after clicky click.");
      console.log(article);

      $("#comments").empty();

      // The headline of the article
      $("#comments").append("<h2>" + article.headline + "</h2>");
      
      var comment_section = $("<div>");
      comment_section.attr("id", "comment_section");
      comment_section.append("<h2>Comments</h2>");
      $("#comments").append(comment_section);

      console.log("article -> " + article);
      console.log("comments (should be populated) -> " + article.comments);
      console.log("there should be " + article.comments.length + " comments.");
      for (var i = 0; i < article.comments.length; i++) {
        loadComment(article.comments[i]);
      }
      

      $("#comments").append("<h3>Add Comment:</h3>");
   
      // An input to enter a new headline
      $("#comments").append("<label for='headlineinput'>Title:</label>");
      $("#comments").append("<input id='headlineinput' name='headline' />");
      
      // A textarea to add a new Comment body
      
      $("#comments").append("<label for='bodyinput'>Comment:</label>");
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<label for='authorinput'>Author Name:</label>");
      $("#comments").append("<input id='authorinput' name='author' />");
      // A button to submit a new Comment, with the id of the article saved to it
      $("#comments").append("<button data-id='" + article._id + "' id='saveComment'>Save Comment</button>");
     
}

function loadComment(comment) {
  var comment_div = $("<div/>");
  comment_div.addClass("card");
  comment_div.attr("id", "comment-card");
  comment_div.attr("data-id", comment._id);
  comment_div.css("width", "18rem;");

  var headline = $("<h3/>");
  headline.text(comment.headline);
  comment_div.append(headline);

  var body =  $("<h5/>");
  console.log("===> comment body = " + comment.body);
  body.text(comment.body);
  comment_div.append(body);

  var author =  $("<h7/>");
  author.text(comment.author);
  comment_div.append(author);
 
  comment_div.append("<button data-id='" + comment._id + "' id='deleteComment'>Delete Comment</button>");
 
  $("#comment_section").append(comment_div);
}

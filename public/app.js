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
      console.log("Got Article after clicky click.");
      console.log(data);



      $("#comments").empty();

      

      // The headline of the article
      $("#comments").append("<h2>" + data.headline + "</h2>");
      
      for (var i = 0; i < data.comments.length; i++) {
        var comment_div = $("<div/>");
        comment_div.addClass("card");
        comment_div.attr("id", "comment-card");
        comment_div.attr("data-id", data.comments[i]._id);
        comment_div.css("width", "18rem;");

        var headline = $("<h3/>");
        headline.text(data.comments[i].headline);
        comment_div.append(headline);

        var body =  $("<h5/>");
        body.text(data.comments[i].body);
        comment_div.append(body);

        var author =  $("<h7/>");
        body.text(data.comments[i].author);
        comment_div.append(author);

       
        comment_div.append("<button data-id='" + data.comments[i]._id + "' id='deleteComment'>Delete Comment</button>");
       
        $("#comments").append(comment_div);

        // $("#comments").append("<h3>" + data.comments[i].headline + "</h3>");
        // $("#comments").append("<h5>" + data.comments[i].body + "</h5>");
        // $("#comments").append("<h7>Author: " + data.comments[i].author + "</h7>");
      }
   
      // An input to enter a new headline
      $("#comments").append("<input id='headlineinput' name='headline' />");
      
      // A textarea to add a new Comment body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#comments").append("<input id='authorinput' name='author' />");
      // A button to submit a new Comment, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

      // If there's a Comment in the article
      // if (data.Comment) {
      //   // Place the headline of the Comment in the headline input
      //   $("#headlineinput").val(data.Comment.headline);
      //   $("#authorinput").val(data.Comment.author);
      //   // Place the body of the Comment in the body textarea
      //   $("#bodyinput").val(data.Comment.body);
      // }
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
      console.log(data);
      // Empty the Comments section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for Comment entry
  $("#headlineinput").val("");
  $("#bodyinput").val("");
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

      // remove that comment
      var hopefully_the_rightdiv = $("div[data-id= " + thisId + "]");
      console.log(hopefully_the_rightdiv);
      hopefully_the_rightdiv.remove();
      
      //$("div[data-id= " + thisId + "]").remove();

    });


});

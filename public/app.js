// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class=\"front-card\"><p data-id='" + data[i]._id + "'> <strong>" + data[i].headline + "</strong><br /> " + data[i].summary + "<br />  <a href=" + data[i].link+ ">" + data[i].link + "</a></p></div>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".front-card", function() {
  console.log("Clicky Click");
  // Empty the Comments from the Comment section
  $("#Comments").empty();
  // Save the id from the p tag
  var thisId = $(this).find("p").attr("data-id");
  console.log("id = " + thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the Comment information to the page
    .then(function(data) {
      // The headline of the article
      $("#Comments").append("<h2>" + data.headline + "</h2>");
      // An input to enter a new headline
      $("#Comments").append("<input id='headlineinput' name='headline' >");
      // A textarea to add a new Comment body
      $("#Comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new Comment, with the id of the article saved to it
      $("#Comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

      // If there's a Comment in the article
      if (data.Comment) {
        // Place the headline of the Comment in the headline input
        $("#headlineinput").val(data.Comment.headline);
        // Place the body of the Comment in the body textarea
        $("#bodyinput").val(data.Comment.body);
      }
    });
});

// When you click the saveComment button
$(document).on("click", "#saveComment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the Comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from headline input
      headline: $("#headlineinput").val(),
      // Value taken from Comment textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the Comments section
      $("#Comments").empty();
    });

  // Also, remove the values entered in the input and textarea for Comment entry
  $("#headlineinput").val("");
  $("#bodyinput").val("");
});

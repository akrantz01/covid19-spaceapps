function displayFeed() {
    $("#FEED").show();
    $("#WELLNESS").hide();
    $("#feed_button").css("opacity", 1);
    $("#wellness_button").css("opacity", 0.3);
  }

function displayWellness() {
    $("#WELLNESS").show();
    $("#wellness_button").css("opacity", 1);
    $("#feed_button").css("opacity", 0.3);
    $("#FEED").hide();
}

$(document).ready(function() {
    displayFeed();
});

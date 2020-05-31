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
    $("#pol").hide();
}

$(document).ready(function() {
    displayFeed();
});

//backend people: change the following function for pollution detection!
function chngimg() {
    if (true) { //In particular, change this!!! if pollution low.
        $("#tree").css("opacity", 1);
        $("#house").css("opacity", 0.3);
        $("#pol").hide();
        $("#nopol").show();
    }
     else {
        $("#tree").css("opacity", 0.3);
        $("#house").css("opacity", 1);
        $("#pol").show();
        $("#nopol").hide();
    }

}
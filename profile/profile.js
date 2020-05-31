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

//backend people: change the following function for pollution detection!
function chngimg() {
    var tree = document.getElementById('tree').src;
    var house = document.getElementById('house').src;
    if (true) { //In particular, change this!!!
        document.getElementById('tree').src  = 'assets/health_tree.png';
        document.getElementById('house').src  = 'assets/health_home.png';
    }
     else {
        document.getElementById('tree').src  = 'assets/health_tree.png';
        document.getElementById('house').src  = 'assets/health_home.png';
    }

}
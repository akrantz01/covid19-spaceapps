function displayFeed() {
    $("#FEED").show();
    $("#WELLNESS").hide();
  }

function displayWellness() {
    $("#WELLNESS").show();
    $("#FEED").hide();
}

$(document).ready(function() {
    document.getElementById('WELLNESS').style.display = 'none';
});

function swap(elementid) {
      document.getElementById(elementid).src = "assets/health_cup_full.png"; 
}

document.getElementById("cup1").addEventListener("click", function() {
    swap("cup1");
}, false);
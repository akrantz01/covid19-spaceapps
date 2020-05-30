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

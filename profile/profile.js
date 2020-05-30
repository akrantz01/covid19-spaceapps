function displayFeed() {
    document.getElementById("FEED").display = "block";
    document.getElementById("WELLNESS").display = "none";
  } 

function displayWellness() {
    document.getElementById("WELNESS").display = "block";
    document.getElementById("FEED").display = "none";
} 

window.onload = function() {
    document.getElementById('WELLNESS').style.display = 'none';
};
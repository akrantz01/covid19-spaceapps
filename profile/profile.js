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
  $(".ringBell").click(function(){
    createNewNotif();
  });
});

//backend people: change the following function for pollution detection!
function chngimg() {
  if (true) { //In particular, change this!!! if pollution low.
    $("#tree").css("opacity", 1);
    $("#house").css("opacity", 0.3);
    $("#pol").hide();
    $("#nopol").show();
  } else {
    $("#tree").css("opacity", 0.3);
    $("#house").css("opacity", 1);
    $("#pol").show();
    $("#nopol").hide();
  }
}

function goHome() {
  window.location.href = "../index.html";
}

//LOCATION SCRIPTS//
function getLocation() {
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showPosition, showError);
  else alert("Geolocation is not supported by this browser.");
}

function showPosition(position) { //change later
  localStorage.setItem('pos', position.coords);
  $("#location").css("opacity", 1);
  let posString = "(" + Math.round(position.coords.latitude) +
  "," + Math.round(position.coords.longitude) + ")";
  $("#location p").html(posString);
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

//NOTIFICATIONS//
function createNewNotif(text){
  var notif = document.createElement('div');
  document.getElementById('notif_container').appendChild(notif);
  notif.appendChild(document.createTextNode('notif1'));
  notif.setAttribute("class", "notif_object");
}

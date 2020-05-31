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
    Self.notifications('secure-testing-auth').then(readNotifs);
    //reateNewNotif();
  });
});

//NOTIFICATIONS//

function readNotifs(n){
  for(let i=0; i < n.data.comments.length; i++) createNewCommentNotif(n.data.comments[i]);
  for(let i=0; i < n.data.friend_requests.length; i++) createNewFriendRequestNotif(n.data.friend_requests[i]);
}

function createNewCommentNotif(text){
  let notif = document.createElement('div');
  document.getElementById('notif_container').appendChild(notif);
  notif.appendChild(document.createTextNode("Someone commented: " + text));
  notif.setAttribute("class", "notif_object");
}

function createNewFriendRequestNotif(text){
  let notif = document.createElement('div');
  document.getElementById('notif_container').appendChild(notif);
  notif.appendChild(document.createTextNode(text + " sent you a friend request!"));
  let acceptButton = document.createElement("button");
  acceptButton.innerHTML = "Y";
  let rejectButton = document.createElement("button");
  rejectButton.innerHTML = "N";
  notif.appendChild(acceptButton);
  notif.appendChild(rejectButton);
  notif.setAttribute("class", "notif_object");
}

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

//BACK END//
const url = "https://us-central1-covid19-spaceapps.cloudfunctions.net/api";

async function sendRequest(method, path, token, body= null) {
    // Build request
    let options = {
        method: method,
        headers: {
            Authorization: token,
        }
    }

    // Add options for POST/PUT requests
    if ((path === "POST" || path === "PUT") && body !== null) options.headers["Content-Type"] = "application/json";
    if (body !== null) options.body = body;

    // Send & parse requests
    let response = await fetch(`${url}${path}`, options);
    let json = await response.json();

    // Generate return data
    let base = { code: response.status, success: response.ok }
    if (response.ok) base.data = json.data;
    else base.reason = json.reason;

    return base;
}

class Self {
    // Get the current user's basic information
    static async read(token) {
        return await sendRequest("GET", "/users/self", token);
    }

    // Get the current user's notifications
    // This includes comments and friend requests
    static async notifications(token) {
        return await sendRequest("GET", "/users/self/notifications", token);
    }

    // Send a friend request
    static async friend_request(user_id, accept, token) {
        return await sendRequest("PUT", "/users/self/friends", token, { friend: user_id, accept: accept });
    }
}

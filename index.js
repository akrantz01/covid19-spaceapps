function goProfile() {
  window.location.href = "profile/profile.html";
}

$(document).ready(function() {
  saveProfile(); //calls every time on profile? okay for preview?
  updateCount();
  $(".ringBell").click(function() {
    if (notif_container == null) Self.notifications('secure-testing-auth').then(readNotifs);
    else hideNotifs();
  });
  $('html').click(function(e) {
    if (e.target.id != 'notif_container' && notif_container != null) hideNotifs();
  });
});

function saveProfile() {
  if(localStorage.getItem('Name')==null){
    Self.read('secure-testing-auth').then(function(e) {
      $("#name").html("Hi " + e.data.name.toUpperCase() + "!");
      localStorage.setItem('Name', e.data.name);
      localStorage.setItem('Bio', "id: " + e.data.id + "<br>" + e.data.bio);
    });
  } else {
    $("#name").html("Hi " + localStorage.getItem('Name').toUpperCase() + "!");
  }
}

//NOTIFICATIONS//
let notif_container = null;

function updateProfile() {
  $("#name").html(localStorage.getItem('Name'));
  $("#bio").html(localStorage.getItem('Bio'));
}

function updateCount() {
  let count = 0;
  Self.notifications('secure-testing-auth').then(function(e) {
    if(e.data.comments.length + e.data.friend_requests.length > 0) $("span.-count").html('!');
    else $("span.-count").hide();
  });
}

function hideNotifs() {
  if(notif_container) notif_container.remove();
  notif_container = null;
  updateCount();
}

function readNotifs(n) {
  notif_container = document.createElement('div');
  notif_container.setAttribute('id', 'notif_container');
  document.getElementById('notif_parent_container').appendChild(notif_container);
  for (let i = 0; i < n.data.comments.length; i++) createNewCommentNotif(n.data.comments[i]);
  for (let i = 0; i < n.data.friend_requests.length; i++) createNewFriendRequestNotif(n.data.friend_requests[i]);
}

function createNewCommentNotif(text) {
  let notif = document.createElement('div');
  notif_container.appendChild(notif);
  notif.appendChild(document.createTextNode("Someone commented: " + text));
  notif.setAttribute("class", "notif_object");
}

function createNewFriendRequestNotif(text) {
  let notif = document.createElement('div');
  notif_container.appendChild(notif);
  notif.appendChild(document.createTextNode(text + " sent you a friend request!"));
  let acceptButton = document.createElement("button");
  acceptButton.innerHTML = "Y";
  acceptButton.setAttribute('onclick', respondToRequest(text, true, notif));
  let rejectButton = document.createElement("button");
  rejectButton.innerHTML = "N";
  rejectButton.setAttribute('onclick', respondToRequest(text, false, notif));
  notif.appendChild(document.createElement("br"));
  notif.appendChild(acceptButton);
  notif.appendChild(rejectButton);
  notif.setAttribute("class", "notif_object");
}

function respondToRequest(user, bool, obj) {
  Self.friend_request(user, bool, 'secure-testing-auth').then(function() {
    hideNotifs();
  });
}

//BACK END//
const url = "https://us-central1-covid19-spaceapps.cloudfunctions.net/api";

// Helper function
async function sendRequest(method, path, token, body = null) {
  // Build request
  let options = {
    method: method,
    headers: {
      Authorization: token,
    }
  }

  // Add options for POST/PUT requests
  if ((method === "POST" || method === "PUT") && body !== null) options.headers["Content-Type"] = "application/json";
  if (body !== null) options.body = JSON.stringify(body);

  // Send & parse requests
  let response = await fetch(`${url}${path}`, options);
  let json = await response.json();

  // Generate return data
  let base = {
    code: response.status,
    success: response.ok
  }
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
    return await sendRequest("PUT", "/users/self/friends", token, {
      friend: user_id,
      accept: accept
    });
  }
}

function goProfile() {
  window.location.href = "profile/profile.html";
}

$(document).ready(function() {
  saveProfile(); //calls every time on profile? okay for preview?
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

function goProfile() {
  window.location.href = "profile/profile.html";
}

var toggled = true;

$(document).ready(function() {
  saveProfile(); //calls every time on profile? okay for preview?
  updateCount();
  getPosts(toggled);
  getPicture();

  $(".ringBell").click(function() {
    if (notif_container == null) Self.notifications('secure-testing-auth').then(readNotifs);
    else hideNotifs();
  });

  $('html').click(function(e) {
    if (e.target.id != 'notif_container' && notif_container != null) hideNotifs();
  });

  $(".show-more").click(function () {
      if($(".text").hasClass("show-more-height")) $(this).text("(Show Less)");
      else $(this).text("(Show More)");
      $(".text").toggleClass("show-more-height");
  });

  $('#comment-button').click(function(){
    let id = $(".comments .post").attr('id');
    let content = $("#tweet").val();
    Posts.comment(id, content, 'secure-testing-auth');
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

//ASTROPIX//
function getPicture(){
  fetch("https://api.nasa.gov/planetary/apod?api_key=GAbtYQKA3ehOsoGrOrE4mHyFbsT8v4sVnovrBqoj").then(function(e){
    return e.json();
  }).then(function(myJson){
    document.querySelector("#astropix").setAttribute('src', myJson.hdurl);
    document.querySelector("#astropix-description").innerHTML = myJson.explanation;
    document.querySelector("#source").innerHTML = myJson.copyright;
  }).catch(function(error){
    console.log("Error: " + error);
  });
}

//POSTS//

function toMainFeed(){
  $("#post-parent").show();
  $(".comments").hide();
  $(".switch").show();
}

function getPosts(toggleOn){
  document.getElementById("post-parent").querySelectorAll('*').forEach(n=>n.remove());
  let postArray;
  Posts.list('secure-testing-auth').then(function(e){
    postArray = e.data;
    if(toggleOn){
      for(let i=0;i < postArray.length; i++) {
        if (calcTonePositivity(postArray[i].tones) > 0.5){
          generatePost(postArray[i].by, postArray[i].content, postArray[i].id, postArray[i].tones);
        }
      }
    } else {
      for(let i=0;i < postArray.length; i++) {
        generatePost(postArray[i].by, postArray[i].content, postArray[i].id, postArray[i].tones);
      }
    }
    $("#loading").hide();
  });
}

function togglePos(){
  console.log(toggled);
  if (toggled === true)  toggled = false;
  else  toggled = true;
  getPosts(toggled);
}

let commentArray;

function calcTonePositivity(arr) {
  var total = 0;
  var num = 0;
  for (var i=0; i < arr.length; i++){
    if (arr[i].tone_id === 'anger' || arr[i].tone_id === 'sadness' || arr[i].tone_id === 'fear') {
      total -= arr[i].score;
      num += 1;
    } else if (arr[i].tone_id === 'joy' || arr[i].tone_id === 'confident'){
      total += arr[i].score;
      num += 1;
    }
  }
  if (num > 0)  return ((total/num+1)/2);
  return 0.5;
}

function lerpColor(a, b, amount) { 

  var ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function generatePost(user, text, id, arr){
  let post = document.createElement('div');
  document.getElementById("post-parent").appendChild(post);
  post.setAttribute("class", "post");
  let postHeader = document.createElement('div');
  post.appendChild(postHeader);
  postHeader.setAttribute('class', 'post-header');
  postHeader.appendChild(document.createTextNode(user));
  post.appendChild(document.createElement("br"));
  let postBody = document.createTextNode(text);
  post.appendChild(postBody);
  
  var pos = calcTonePositivity(arr);
  var color = lerpColor('#F06B43', '#F1A075', pos);
  post.style.backgroundColor = color;


  post.addEventListener('click', function(){
    Posts.read(id, 'secure-testing-auth').then(function(e){
      $(".comments .post-header").html(user);
      $(".comments .post p").html(text);
      $(".comments .post").attr('id', id);

      let parent = document.getElementById("comment-parent");

      if(commentArray==undefined || commentArray==null){
        commentArray = e.data.comments;
        for(let i=0; i < commentArray.length; i++) createNewComment(parent, commentArray[i].by, commentArray[i].content);
      } else if (commentArray != e.data.comments) {
        parent.querySelectorAll('*').forEach(n=>n.remove());
        commentArray = e.data.comments;
        for(let i=0; i < commentArray.length; i++) createNewComment(parent, commentArray[i].by, commentArray[i].content);
      }

      $("#post-parent").hide();
      $(".comments").show();
      $(".switch").hide();
    });
  });
  $("div.comments").hide();
}

function createNewComment(parent, user, text){
  let comment = document.createElement('div');
  parent.appendChild(comment);
  comment.setAttribute("class", "comment");
  let commentHeader = document.createElement('div');
  comment.appendChild(commentHeader);
  commentHeader.appendChild(document.createTextNode(user + " says: " + text));
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
  acceptButton.addEventListener('click', function(){
    Self.friend_request(text, true, 'secure-testing-auth').then(function() {
      hideNotifs();
    });
  });
  let rejectButton = document.createElement("button");
  rejectButton.innerHTML = "N";
  rejectButton.addEventListener('click', function(){
    Self.friend_request(text, false, 'secure-testing-auth').then(function() {
      hideNotifs();
    });
  });
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

// Interact with post data
class Posts {
    // List all posts ordered by the most recent post
    static async list(token) {
        return await sendRequest("GET", "/posts", token);
    }

    // Write a new post
    static async create(content, token) {
        return await sendRequest("POST", "/posts", token, { content: content });
    }

    // Get the finer details about a post
    // This includes comments and any other data that is added in the future
    static async read(post_id, token) {
        return await sendRequest("GET", `/posts/${post_id}`, token);
    }

    // Make a comment on a post
    static async comment(post_id, content, token) {
        return await sendRequest("POST", `/comments/${post_id}`, token, { content: content });
    }
}

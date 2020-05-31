/*
Some quick notes:

Until authentication is implemented, there are two testing users
associated with the following tokens:
    1:
        token: secure-testing-auth
        id: user-id
    2:
        token: other-secure-testing-auth
        id: another-id
The database is seeded with some basic testing data for each
user's bio and name. There are also three testing posts with one
that has a comment on it.
*/

// URL of the API
const url = "https://us-central1-covid19-spaceapps.cloudfunctions.net/api";

// Helper function
async function sendRequest(method, path, token, body= null) {
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
    let base = { code: response.status, success: response.ok }
    if (response.ok) base.data = json.data;
    else base.reason = json.reason;

    return base;
}

// Interact with other users
class Users {
    // Get another user's basic information
    static async read(user_id, token) {
        return await sendRequest("GET", `/users/${user_id}`, token);
    }

    // Make a friend request
    static async request_friend(user_id, token) {
        return await sendRequest("POST", `/users/${user_id}/friend`, token);
    }
}

// Interact with the current user's data
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

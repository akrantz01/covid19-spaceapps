const router = require("express").Router();
const httpContext = require("express-http-context");
const common = require("./common");

const admin = require("firebase-admin");
const firestore = admin.firestore();

// Get current user details
router.get("/self", (req, res) => firestore.collection("users").doc(httpContext.get("uid")).get()
    .then(snapshot => Object.assign(snapshot.data(), { id: snapshot.id }))
    .then(user => res.status(200).json({ status: "success", data: user }))
    .catch(common.internalError(res, "get-self")));

// Retrieve notifications
router.get("/self/notifications", (req, res) => firestore.collection("notifications").doc(httpContext.get("uid")).get()
    .then(snapshot => ({ status: "success", data: snapshot.data() }))
    .then(body => {
        if (body.data !== undefined) return res.status(200).json(body);
        else return res.status(200).json({ status: "success", data: { comments: [], friend_requests: [] } });
    })
    .catch(common.internalError(res, "get-notifications")));

// Approve or reject a friend request
router.put("/self/friends", async (req, res) => {
    // Parse response body
    if (!req.body.hasOwnProperty("friend") || !req.body.hasOwnProperty("accept")) res.status(400).json({ status: "error", reason: "invalid request body" });

    // Ensure notifications exist
    let notifications = await firestore.collection("notifications").doc(httpContext.get("uid")).get()
    if (!notifications.exists) return res.status(404).json({ status: "error", reason: "no friend request present"});
    let friendRequests = notifications.data().friend_requests;

    // Ensure friend request exists
    if (friendRequests.filter(request => request === req.body.friend).length === 0) return res.status(404).json({ status: "error", reason: "friend request does not exist" });

    // Potentially add both as friends
    if (req.body.accept) {
        // Add both as friends
        await firestore.collection("users").doc(httpContext.get("uid")).update({ friends: admin.firestore.FieldValue.arrayUnion(req.body.friend)});
        await firestore.collection("users").doc(req.body.friend).update({ friends: admin.firestore.FieldValue.arrayUnion(httpContext.get("uid"))});
    }

    // Remove friend request
    await firestore.collection("notifications").doc(httpContext.get("uid")).update({ friend_requests: admin.firestore.FieldValue.arrayRemove(req.body.friend) });

    res.status(200).json({ status: "success" });
})

// Get another user's details
router.get("/:user", (req, res) => firestore.collection("users").doc(req.params.user).get()
    .then(snapshot => {
        if (!snapshot.exists) return res.status(404).json({ status: "error", reason: "user does not exist"});
        else return res.status(200).json({ status: "success", data: Object.assign(snapshot.data(), { id: snapshot.id })})
    }).catch(common.internalError(res, "get-user")));

// Send a friend request
router.post("/:user/friend", async (req, res) => {
    // Ensure requesting user and authd user are not the same
    if (httpContext.get("uid") === req.params.user) return res.status(400).json({ status: "error", reason: "cannot befriend self" });

    // Retrieve user data
    let user = await firestore.collection("users").doc(req.params.user).get();
    if (!user.exists) return res.status(400).json({ status: "error", reason: "user does not exist" });
    let userData = user.data();

    // Ensure not already friends
    if (userData.friends.filter(user => user === httpContext.get("uid")).length !== 0) return res.status(400).json({ status: "error", reason: "already friends" });

    // Make friend request
    await firestore.collection("notifications").doc(req.params.user).update({
        friend_requests: admin.firestore.FieldValue.arrayUnion(httpContext.get("uid"))
    });

    res.status(200).json({ status: "success" });
});

module.exports = router;

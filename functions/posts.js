const router = require("express").Router();
const httpContext = require("express-http-context");
const common = require("./common");

const admin = require("firebase-admin");
const firestore = admin.firestore();

// List posts
router.get("/", (req, res) =>
    firestore.collection("posts").orderBy("timestamp", "desc").get()
        .then(snapshot => snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id })))
        .then(documents => res.status(200).json({ status: "success", data: documents }))
        .catch(common.internalError(res, "list-posts")));

// Create a post
router.post("/", (req, res) => {
    // Validate request
    if (!req.body.hasOwnProperty("content")) {
        res.status(400).json({ status: "error", reason: "invalid request body" });
        return;
    }

    // Create new post
    firestore.collection("posts").add({
        by: httpContext.get("uid"),
        content: req.body.content,
        timestamp: new admin.firestore.Timestamp(Math.floor((new Date()).getTime() / 1000), 0)
    })
        .then(_ => res.status(200).json({ status: "success" }))
        .catch(common.internalError(res, "create-post"));
})

// Retrieve a post
router.get("/:post", async (req, res) => {
    // Retrieve post data
    let post = await firestore.collection("posts").doc(req.params.post).get();
    if (!post.exists) return res.status(404).json({ status: "error", reason: "post does not exist" });
    let postData = post.data();

    // Retrieve comments
    let snapshot = await firestore.collection(`posts/${req.params.post}/comments`).orderBy("timestamp", "desc").get();

    // Add comments to post
    postData.comments = snapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));

    // Return data
    res.status(200).json({ status: "success", data: postData });
});

module.exports = router;

const router = require("express").Router();
const httpContext = require("express-http-context");
const common = require("./common");

const admin = require("firebase-admin");
const firestore = admin.firestore();

// List posts
router.get("/", (req, res) => {
    firestore.collection("posts").orderBy("timestamp", "desc").get()
        .then(snapshot => snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id })))
        .then(documents => res.status(200).json({ status: "success", data: documents }))
        .catch(common.internalError(res, "list-posts"));
});

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

module.exports = router;

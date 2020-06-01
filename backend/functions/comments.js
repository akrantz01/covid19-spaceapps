const router = require("express").Router();
const httpContext = require("express-http-context");
const common = require("./common");

const admin = require("firebase-admin");
const firestore = admin.firestore();

// Create comment
router.post("/:post", async (req, res) => {
    // Validate request
    if (!req.body.hasOwnProperty("content")) {
        res.status(400).json({ status: "error", reason: "invalid request body" });
        return;
    }

    // Ensure post exists
    let post = await firestore.collection("posts").doc(req.params.post).get()
    if (!post.exists) {
        res.status(404).json({ status: "error", reason: "post does not exist" });
        return;
    }

    // Create new comment on post
    await firestore.collection(`posts/${req.params.post}/comments`).add({
        by: httpContext.get("uid"),
        content: req.body.content,
        timestamp: new admin.firestore.Timestamp(Math.floor((new Date()).getTime() / 1000), 0)
    }).catch(common.internalError(res, "create-comment"));

    // Create new comment
    await firestore.collection(`notifications`).doc(post.data().by).update({
        comments: admin.firestore.FieldValue.arrayUnion(req.body.content)
    }).catch(common.internalError(res, "create-comment"));


    res.status(200).json({ status: "success" });
});

module.exports = router;

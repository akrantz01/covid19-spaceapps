const router = require("express").Router();
const httpContext = require("express-http-context");
const common = require("./common");

const admin = require("firebase-admin");
const firestore = admin.firestore();

// Create comment
router.post("/:post", (req, res) => {
    // Validate request
    if (!req.body.hasOwnProperty("content")) {
        res.status(400).json({ status: "error", reason: "invalid request body" });
        return;
    }

    // Create new comment on post
    firestore.collection(`posts/${req.params.post}/comments`).add({
        by: httpContext.get("uid"),
        content: req.body.content,
        timestamp: new admin.firestore.Timestamp(Math.floor((new Date()).getTime() / 1000), 0)
    })
        .then(_ => res.status(200).json({ status: "success" }))
        .catch(common.internalError(res, "create-comment"));
});

module.exports = router;

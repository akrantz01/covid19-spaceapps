const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const httpContext = require("express-http-context");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("service account");
    const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://covid19-spaceapps.firebaseio.com"
    });
} else admin.initializeApp();

const app = express();
app.use(cors({ origin: true }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(httpContext.middleware)
    .use((req, res, next) => {
        // Ensure token exists
        if (req.get("Authorization") === "" || req.get("Authorization") === undefined) {
            res.status(401).json({ status: "error", reason: "unauthorized" });
            return;
        }

        // Fake authentication for testing
        if (req.get("Authorization") === "secure-testing-auth") {
            httpContext.set("uid", "user-id");
            next();
            return;
        } else if (req.get("Authorization") === "other-secure-testing-auth") {
            httpContext.set("uid", "another-id");
            next();
            return;
        }

        // Validate token
        admin.auth().verifyIdToken(req.get("Authorization"))
            .then(decoded => {
                httpContext.set("uid", decoded.uid);
                next();
            })
            .catch(_ => res.status(401).json({ status: "error", reason: "unauthorized" }));
    })
    .use("/posts", require("./posts"))
    .use("/comments", require("./comments"))
    .use("/users", require("./users"))
    .all("*", (_, res) => res.status(404).json({ status: "error", reason: "not found" }));

exports.api = functions.https.onRequest(app);

// Setup user data on registration
exports.userSetup = functions.auth.user().onCreate(async (user) => {
    // Create user data
    await firebase.firestore().collection("users").doc(user.uid).set({
        bio: "",
        friends: [],
        name: user.displayName
    });

    // Create user notifications
    await firebase.firestore().collection("notifications").doc(user.uid).set({
        friend_requests: [],
        comments: []
    })
});

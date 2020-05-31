const axios = require("axios");
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
app.use(cors({ origin: "*" }))
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
                return next();
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

// Analyze the tone of all new posts
exports.analyzeTone = functions.firestore.document("posts/{postId}").onCreate(async (snapshot, context) => {
    // Retrieve configuration data
    const config = functions.config()["tone-analysis"];

    // Send request
    let response = await axios.get(`${config.url}/v3/tone`, {
        params: {
            version: "2017-09-21",
            text: snapshot.data().content
        },
        auth: {
            username: "apikey",
            password: config.apikey
        },
        responseType: "json"
    });

    // Set no tones if not successful
    if (response.status !== 200) return snapshot.ref.set({ tones: [] }, { merge: true });

    // Modify post
    return snapshot.ref.set({ tones: response.data.document_tone.tones }, { merge: true })
});

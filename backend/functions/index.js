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
    .get("/aqi", async (req, res) => {
        const token = functions.config().waqi.token;

        // Validate request
        if (!req.query.hasOwnProperty("lat") || !req.query.hasOwnProperty("long")) return res.status(400).json({ status: "error", reason: "invalid request parameters" });

        // Send request
        let response = await axios.get("https://api.waqi.info/feed/geo:10.3;20.7/", {
            params: {
                token: token,
                lat: req.query.lat,
                lng: req.query.long
            },
            responseType: "json"
        });
        if (response.status !== 200) return res.status(500).json({ status: "error", reason: "failed to retrieve air quality data" });
        let data = response.data.data;

        return res.status(200).json({
            quality: data.aqi,
            dominant_pollutant: data.dominentpol,
            iaqi: data.iaqi
        });
    })
    .all("*", (_, res) => res.status(404).json({ status: "error", reason: "not found" }));

exports.api = functions.https.onRequest(app);

// Setup user data on registration
exports.userSetup = functions.auth.user().onCreate(async (user) => {
    // Generate user id
    let uid;
    let parts = user.email.split("@");
    if (parts[1] !== "gmail.com" && parts[1] !== "yahoo.com" && parts[1] !== "outlook.com") {
        uid = user.email.replace("@", "-").split(".").reverse().slice(1).reverse().join(".")
    } else {
        uid = parts[0];
    }

    // Create user data
    await admin.firestore().collection("users").doc(uid).set({
        bio: "",
        friends: [],
        name: user.displayName
    });

    // Create user notifications
    await admin.firestore().collection("notifications").doc(uid).set({
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

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const httpContext = require("express-http-context");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use((req, res, next) => {
        // Ensure token exists
        if (req.get("Authorization") === "" || req.get("Authorization") === undefined) {
            res.status(401).json({ status: "error", reason: "unauthorized" });
            return;
        }

        // TODO: handle anonymous users

        // Validate token
        admin.auth().verifyIdToken(req.get("Authorization"))
            .then(decoded => {
                httpContext.set("uid", decoded.uid);
                next();
            })
            .catch(_ => res.status(401).json({ status: "error", reason: "unauthorized" }));
    })
    .all("*", (_, res) => res.status(404).json({ status: "error", reason: "not found" }));

exports.api = functions.https.onRequest(app);

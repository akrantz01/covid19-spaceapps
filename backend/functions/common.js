// Gracefully handle internal server errors
exports.internalError = (res, name) => err => {
    console.error(`Internal server error in ${name}: ${err}`);
    res.status(500).json({ status: "error", reason: "internal server error" });
}

// Translate user's email to id
exports.translateUserID = email => {
    let parts = email.split("@");
    if (parts[1] !== "gmail.com" && parts[1] !== "yahoo.com" && parts[1] !== "outlook.com") {
        return email.replace("@", "-").replace(".", "-")
    }
    return parts[0]
}

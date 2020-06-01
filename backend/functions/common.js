// Gracefully handle internal server errors
exports.internalError = (res, name) => err => {
    console.error(`Internal server error in ${name}: ${err}`);
    res.status(500).json({ status: "error", reason: "internal server error" });
}

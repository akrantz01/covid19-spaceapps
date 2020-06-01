$(document).ready(() => {
    $("#login").on("click", function(event) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        firebase.auth().signInWithPopup(provider)
            .then(res => {
                // Set display name
                localStorage.setItem("name", res.user.displayName);

                // Generate user id
                let uid;
                let parts = res.user.email.split("@");
                if (parts[1] !== "gmail.com" && parts[1] !== "yahoo.com" && parts[1] !== "outlook.com") {
                    uid = res.user.email.replace("@", "-").replace(".", "-")
                } else {
                    uid = parts[0];
                }
                localStorage.setItem("user-id", uid);
            })
            .then(() => firebase.auth().currentUser.getIdToken(true))
            .then(token => localStorage.setItem("token", token))
            .then(() => window.location.pathname = window.location.pathname.split("/").reverse().slice(1).reverse().join("/") + "/index.html")
            .catch(err => console.log(err));
    });
});

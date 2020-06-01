$(document).ready(() => {
    $("#login").on("click", function(event) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        firebase.auth().signInWithPopup(provider)
            .then(res => {
                localStorage.setItem("token", res.credential.idToken);
                localStorage.setItem("name", res.user.displayName);
                localStorage.setItem("user-id", res.user.email.replace("@", "-").split(".").reverse().slice(1).reverse().join("."));
            })
            .then(() => window.location.pathname = window.location.pathname.split("/").reverse().slice(1).reverse().join("/") + "/index.html")
            .catch(err => console.log(err));
    });
});

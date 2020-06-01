$(document).ready(() => {
    $("#login-create").on("submit", function(event) {
        event.preventDefault();

        switch (event.originalEvent.submitter.id) {
            case "login":
                login();
                break;

            case "create":
                create();
                break;
        }
    });
});

function login() {
    const email = $("#email").val();
    const password = $("#psw").val();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => firebase.auth().currentUser.getIdToken(true))
        .then(token => localStorage.setItem("token", token))
        .then(() => window.location.pathname = window.location.pathname.split("/").reverse().slice(1).reverse().join("/") + "/index.html")
        .catch(err => console.log(err));
}

function create() {
    const email = $("#email").val();
    const password = $("#psw").val();
    console.log(`Email: ${email}\tPassword: ${password}`);

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => login())
        .catch(err => console.log(err));
}
